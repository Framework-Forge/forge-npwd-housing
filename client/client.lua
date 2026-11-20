-- forge-npwd-housing | client.lua
-- Comunicação segura NUI ↔ Client Lua via pr_bridge e forge-housing
-- Zero dependências legadas (sem qb-core, sem qb-houses, sem oxmysql)

local PHONE_RESOURCE = 'forge-npwd'

local function phoneCall(method, ...)
    if GetResourceState(PHONE_RESOURCE) ~= 'started' then return false end
    -- Protect lookup as well as invocation during phone startup/restart.
    return pcall(function(...)
        local phone = exports[PHONE_RESOURCE]
        return phone[method](phone, ...)
    end, ...)
end

CreateThread(function()
    print('^2[forge-npwd-housing]^0 Client inicializado com pr_bridge. pr_lib ativo: ' .. tostring(pr_lib ~= nil))
end)

-- A identidade exibida no aplicativo pertence ao aparelho, nunca ao portador físico.
local function getPlayerCitizenId()
    local okOwner, owner = pcall(pr_lib.callback.await, 'forge-npwd-housing:server:getPhoneOwner', 8000)
    if okOwner and owner and owner ~= '' then return tostring(owner) end
    return nil
end

-- Verifica se um determinado citizenid está presente em uma lista (tabela ou JSON)
local function containsCitizenId(list, cid)
    if not list or not cid then return false end
    if type(list) == 'string' then
        local ok, decoded = pcall(json.decode, list)
        list = ok and decoded or {}
    end
    if type(list) ~= 'table' then return false end
    for _, val in pairs(list) do
        if type(val) == 'table' and val.citizenid then
            if tostring(val.citizenid) == tostring(cid) then return true end
        elseif tostring(val) == tostring(cid) then
            return true
        end
    end
    return false
end

-- Decodifica tax_data de forma segura
local function parseTaxData(taxData)
    if type(taxData) == 'string' then
        local ok, decoded = pcall(json.decode, taxData)
        taxData = ok and decoded or {}
    end
    return type(taxData) == 'table' and taxData or {}
end

-- ============================================================================
-- NUI CALLBACK: getProperties
-- Retorna os imóveis onde o jogador é proprietário e imóveis onde possui acesso
-- ============================================================================
RegisterNUICallback('getProperties', function(data, cb)
    local citizenid = getPlayerCitizenId()
    print('^3[forge-npwd-housing]^0 NUI getProperties chamado. CitizenID:', tostring(citizenid))

    if not citizenid then
        return cb({
            status = 'error',
            message = 'Não foi possível identificar o jogador.',
            data = { owned = {}, access = {}, citizenid = '' }
        })
    end

    local success, allProperties = pcall(pr_lib.callback.await, 'forge-housing:server:requestProperties', 10000)
    if not success or type(allProperties) ~= 'table' then
        print('^1[forge-npwd-housing]^0 Erro ao chamar forge-housing:server:requestProperties:', tostring(allProperties))
        return cb({
            status = 'error',
            message = 'Erro ao consultar imóveis no servidor.',
            data = { owned = {}, access = {}, citizenid = citizenid }
        })
    end

    local owned = {}
    local access = {}

    for _, prop in pairs(allProperties) do
        -- Suporta tanto objeto Property (prop.propertyData) quanto tabela plana (prop)
        local pData = (type(prop) == 'table' and prop.propertyData) or prop

        if type(pData) == 'table' and pData.property_id then
            local ownerId = pData.owner and tostring(pData.owner) or (pData.owner_citizenid and tostring(pData.owner_citizenid) or nil)
            local propCopy = {
                property_id = tostring(pData.property_id),
                owner = ownerId,
                street = pData.street or 'Endereço Desconhecido',
                region = pData.region or 'San Andreas',
                shell = pData.shell or '',
                for_sale = pData.for_sale or 0,
                price = tonumber(pData.price) or 0,
                category = pData.category or (pData.apartment and 'apartment' or 'house'),
                apartment = pData.apartment,
                description = pData.description or '',
                tax_data = parseTaxData(pData.tax_data),
                extra_imgs = type(pData.extra_imgs) == 'table' and pData.extra_imgs or {},
                door_data = pData.door_data or {},
                garage_data = pData.garage_data,
            }

            if ownerId == citizenid then
                owned[#owned + 1] = propCopy
            else
                local hasKey = containsCitizenId(pData.has_access, citizenid)
                local hasAdmin = containsCitizenId(pData.admin_access, citizenid)
                if hasKey or hasAdmin then
                    propCopy.accessType = hasAdmin and 'admin' or 'key'
                    access[#access + 1] = propCopy
                end
            end
        end
    end

    print('^2[forge-npwd-housing]^0 getProperties retornado com sucesso. Próprios:', #owned, 'Acesso:', #access)

    cb({
        status = 'ok',
        data = {
            citizenid = citizenid,
            owned = owned,
            access = access,
        }
    })
end)

-- ============================================================================
-- NUI CALLBACK: getPropertyDetails
-- Retorna faturas, lista de chaves, administradores e termos de transferência
-- ============================================================================
RegisterNUICallback('getPropertyDetails', function(data, cb)
    local propertyId = data and data.property_id
    if not propertyId then
        return cb({ status = 'error', message = 'ID do imóvel não informado.' })
    end

    local success, result = pcall(pr_lib.callback.await, 'forge-housing:cb:getPropertyManagement', 10000, tostring(propertyId))
    if not success or not result then
        return cb({ status = 'error', message = 'Detalhes de gestão indisponíveis ou sem permissão.' })
    end

    local citizenid = getPlayerCitizenId()
    result.hasKey = true
    result.isAdmin = result.isOwner or containsCitizenId(result.admins, citizenid)

    cb({ status = 'ok', data = result })
end)

-- ============================================================================
-- NUI CALLBACK: setWaypoint
-- Marca o destino no GPS do FiveM para a entrada do imóvel
-- ============================================================================
RegisterNUICallback('setWaypoint', function(data, cb)
    local coords = data and data.coords

    if not coords or not coords.x or not coords.y then
        local propertyId = data and data.property_id
        if propertyId then
            local ok, all = pcall(pr_lib.callback.await, 'forge-housing:server:requestProperties', 5000)
            if ok and type(all) == 'table' then
                for _, p in pairs(all) do
                    local pData = (type(p) == 'table' and p.propertyData) or p
                    if tostring(pData.property_id) == tostring(propertyId) then
                        local doors = pData.door_data
                        if type(doors) == 'table' and doors[1] then
                            coords = doors[1].origin or doors[1]
                        end
                        break
                    end
                end
            end
        end
    end

    if coords and coords.x and coords.y then
        SetNewWaypoint(tonumber(coords.x) + 0.0, tonumber(coords.y) + 0.0)
        if pr_lib and pr_lib.notify then
            pr_lib.notify({ title = 'Forge Imóveis', description = 'Destino marcado no GPS.', type = 'success' })
        end
        return cb({ status = 'ok', message = 'Destino marcado no GPS.' })
    end

    cb({ status = 'error', message = 'Coordenadas do imóvel não encontradas.' })
end)

-- ============================================================================
-- NUI CALLBACK: payBill
-- Realiza o pagamento de faturas (luz, agua, iptu, all)
-- ============================================================================
RegisterNUICallback('payBill', function(data, cb)
    local propertyId = data and data.property_id
    local billKey = data and data.billKey or 'all'
    if not propertyId then
        return cb({ status = 'error', message = 'ID do imóvel não informado.' })
    end

    local ok, message = pr_lib.callback.await('forge-housing:cb:payPropertyTaxes', 10000, tostring(propertyId), billKey)
    cb({
        status = ok and 'ok' or 'error',
        data = ok,
        message = message or (ok and 'Fatura paga com sucesso.' or 'Falha ao realizar pagamento.')
    })
end)

-- ============================================================================
-- NUI CALLBACK: getNearbyPlayers
-- Retorna os jogadores online próximos para repasse de chaves ou transferência
-- ============================================================================
RegisterNUICallback('getNearbyPlayers', function(data, cb)
    local ok, players = pcall(pr_lib.callback.await, 'forge-housing:cb:getNearbyPlayers', 10000)
    if not ok or type(players) ~= 'table' then
        return cb({ status = 'ok', data = {} })
    end

    cb({ status = 'ok', data = players })
end)

-- ============================================================================
-- NUI CALLBACK: giveAccess
-- Concede chave ou permissão de administrador para um jogador próximo
-- ============================================================================
RegisterNUICallback('giveAccess', function(data, cb)
    local action = data and data.action
    local propertyId = data and data.property_id
    local targetSource = data and tonumber(data.targetSource)

    if not propertyId or not targetSource then
        return cb({ status = 'error', message = 'Dados incompletos para concessão de acesso.' })
    end

    local callbackName = action == 'giveAdmin' and 'forge-housing:cb:givePropertyAdmin' or 'forge-housing:cb:givePropertyKey'
    local ok, message = pr_lib.callback.await(callbackName, 10000, tostring(propertyId), targetSource)

    cb({
        status = ok and 'ok' or 'error',
        data = ok,
        message = message or (ok and 'Acesso concedido com sucesso.' or 'Não foi possível conceder acesso.')
    })
end)

-- ============================================================================
-- EVENTO: Notificação de Acesso / Chave Recebida no Celular (Forge NPWD)
-- ============================================================================
RegisterNetEvent('forge-npwd-housing:client:notifyAccessGranted', function(data)
    local street = data and data.street or 'um imóvel'
    local isKey = data and data.type ~= 'admin'
    local title = isKey and 'Nova Chave Recebida!' or 'Acesso Administrativo Recebido!'
    local msg = isKey and ('Você recebeu a chave do imóvel em %s.'):format(street)
                      or ('Você foi nomeado administrador do imóvel em %s.'):format(street)

    -- Notificação nativa do Forge NPWD (banner no celular)
    phoneCall('createSystemNotification', {
        uniqId = ('forge-npwd-housing:access:%s'):format(GetGameTimer()),
        content = msg,
        secondaryTitle = 'Forge Imóveis',
        keepOpen = false,
        duration = 8000,
    })

    phoneCall('createNotification', {
        notisId = ('forge-npwd-housing:access:%s'):format(GetGameTimer()),
        app = 'forge-npwd-housing',
        title = title,
        content = msg,
        duration = 8000,
    })

    -- Som de sucesso nativo do GTA
    PlaySoundFrontend(-1, 'CHECKPOINT_PERFECT', 'HUD_MINI_GAME_SOUNDSET', true)

    -- Atualiza NUI caso o aplicativo esteja aberto na tela
    SendNUIMessage({
        action = 'refreshProperties',
        data = data
    })
end)

-- Listener de atualizações de propriedades broadcast do forge-housing
RegisterNetEvent('forge-housing:client:updateProperty', function(action, propertyId, data)
    if action == 'UpdateHas_access' or action == 'UpdateAdminAccess' or action == 'UpdateOwner' then
        SendNUIMessage({
            action = 'refreshProperties',
            propertyId = propertyId,
            actionType = action
        })
    end
end)

-- ============================================================================
-- NUI CALLBACK: revokeAccess
-- Revoga chave ou permissão de administrador de um cidadão
-- ============================================================================
RegisterNUICallback('revokeAccess', function(data, cb)
    local action = data and data.action
    local propertyId = data and data.property_id
    local targetCitizenId = data and data.targetCitizenId

    if not propertyId or not targetCitizenId then
        return cb({ status = 'error', message = 'Dados incompletos para revogação de acesso.' })
    end

    local callbackName = action == 'revokeAdmin' and 'forge-housing:cb:revokePropertyAdmin' or 'forge-housing:cb:revokePropertyKey'
    local ok, message = pr_lib.callback.await(callbackName, 10000, tostring(propertyId), tostring(targetCitizenId))

    cb({
        status = ok and 'ok' or 'error',
        data = ok,
        message = message or (ok and 'Acesso revogado com sucesso.' or 'Não foi possível revogar acesso.')
    })
end)

-- ============================================================================
-- NUI CALLBACK: transferProperty
-- Inicia a proposta de venda e transferência do imóvel
-- ============================================================================
RegisterNUICallback('transferProperty', function(data, cb)
    local propertyId = data and data.property_id
    local targetSource = data and tonumber(data.targetSource)
    local price = data and tonumber(data.price)
    local revision = data and tonumber(data.revision) or 0

    if not propertyId or not targetSource or not price then
        return cb({ status = 'error', message = 'Dados incompletos para transferência.' })
    end

    local ok, message = pr_lib.callback.await('forge-housing:cb:transferProperty', 45000, tostring(propertyId), targetSource, price, revision)

    cb({
        status = ok and 'ok' or 'error',
        data = ok,
        message = message or (ok and 'Proposta de transferência enviada.' or 'Falha ao transferir imóvel.')
    })
end)

-- ============================================================================
-- NUI CALLBACK: getSecurityState
-- Obtém o estado de alarme, monitoramento e câmeras do imóvel
-- ============================================================================
RegisterNUICallback('getSecurityState', function(data, cb)
    local propertyId = data and data.property_id
    if not propertyId then
        return cb({ status = 'error', message = 'ID do imóvel não informado.' })
    end

    local ok, result = pcall(pr_lib.callback.await, 'forge-housing:security', 15000, tostring(propertyId), 'list')
    if not ok or not result or not result.success then
        return cb({
            status = 'error',
            message = (result and result.message) or 'Não foi possível carregar os dados de segurança.',
            data = nil
        })
    end

    cb({
        status = 'ok',
        data = result
    })
end)

-- ============================================================================
-- NUI CALLBACK: toggleSecurityArm
-- Ativa ou desativa o alarme residencial ou a segurança monitorada
-- ============================================================================
RegisterNUICallback('toggleSecurityArm', function(data, cb)
    local propertyId = data and data.property_id
    local kind = data and data.kind
    local enabled = data and data.enabled == true
    local revision = data and tonumber(data.revision) or 0

    if not propertyId or not kind then
        return cb({ status = 'error', message = 'Parâmetros inválidos para alteração de segurança.' })
    end

    local ok, result = pcall(pr_lib.callback.await, 'forge-housing:security', 15000, tostring(propertyId), 'arm', {
        kind = kind,
        enabled = enabled,
        revision = revision
    })

    if not ok or not result or not result.success then
        return cb({
            status = 'error',
            message = (result and result.message) or 'Falha ao alterar o estado do sistema de segurança.',
            data = nil
        })
    end

    cb({
        status = 'ok',
        data = result,
        message = enabled and 'Sistema ativado com sucesso.' or 'Sistema desativado.'
    })
end)

-- ============================================================================
-- NUI CALLBACK: viewSecurityCamera
-- Oculta o celular temporariamente e conecta o jogador à câmera de segurança 3D
-- ============================================================================
local viewingCamera = false
RegisterNUICallback('viewSecurityCamera', function(data, cb)
    local propertyId = data and data.property_id
    local cameraId = data and data.cameraId
    local filter = data and data.filter or 'normal'

    if not propertyId or not cameraId then
        return cb({ status = 'error', message = 'Câmera não selecionada.' })
    end

    if viewingCamera then
        return cb({ status = 'error', message = 'Você já está visualizando uma câmera.' })
    end

    viewingCamera = true

    -- Oculta o celular para liberar os controles da câmera
    phoneCall('setPhoneVisible', false)

    -- Executa a visualização da câmera com câmera nativa do forge-housing
    local ok, result = pcall(function()
        return pr_lib.housing.ViewSecurityCamera(tostring(propertyId), tostring(cameraId), filter)
    end)

    viewingCamera = false

    -- Restaura a visibilidade do celular após o usuário sair da câmera (BACKSPACE/ESC)
    phoneCall('setPhoneVisible', true)

    cb({
        status = 'ok',
        data = ok and result or { success = false },
        message = 'Visualização encerrada.'
    })
end)

-- ============================================================================
-- NUI CALLBACK: dispatchPolice
-- Despacha alerta de invasão (10-90) para a polícia via ps-dispatch
-- ============================================================================
RegisterNUICallback('resolveSecurityIncident',function(data,cb)
    if type(data)~='table' or not data.property_id or (data.action~='dispatch' and data.action~='dismiss') then
        return cb({status='error',message='Ação inválida.'})
    end
    local ok,result=pcall(pr_lib.callback.await,'forge-housing:security',15000,tostring(data.property_id),data.action,
        {incidentAt=tonumber(data.incidentAt)})
    cb(ok and type(result)=='table' and result.success and {status='ok',data=result}
        or {status='error',message=type(result)=='table' and result.message or 'Falha de comunicação.'})
end)
RegisterNUICallback('dispatchPolice', function(data, cb)
    local propertyId = data and data.property_id
    if not propertyId then
        return cb({ status = 'error', message = 'ID do imóvel não informado.' })
    end

    local ok, success, message = pcall(pr_lib.callback.await, 'forge-npwd-housing:server:dispatchPolice', 10000, tostring(propertyId))
    cb({
        status = (ok and success) and 'ok' or 'error',
        data = (ok and success),
        message = message or ((ok and success) and 'Polícia acionada com sucesso! Código 10-90 enviado.' or 'Não foi possível acionar a polícia.')
    })
end)

-- ============================================================================
-- NOTIFICAÇÕES DE ALARME NO CELULAR Forge NPWD
-- ============================================================================
local alarmNotificationSeq = 0

RegisterNetEvent('forge-housing:securityOwnerAlert', function(propertyId, street)
    propertyId = tostring(propertyId)
    street = street or ('Imóvel #' .. propertyId)

    print(('^1[forge-npwd-housing]^0 RECEBIDO securityOwnerAlert! Imóvel: %s, Rua: %s'):format(propertyId, street))

    alarmNotificationSeq = alarmNotificationSeq + 1

    -- 1. Notificação do Sistema Forge NPWD (sobe no canto inferior direito do celular)
    if GetResourceState(PHONE_RESOURCE) == 'started' then
        local ok, err = phoneCall('createSystemNotification', {
            uniqId = ('forge-npwd-housing:%s:%s'):format(GetGameTimer(), alarmNotificationSeq),
            secondaryTitle = '🚨 Alarme Residencial',
            content = ('Invasão detectada em %s!'):format(street),
            keepOpen = false,
            duration = 10000,
            controls = false,
        })
        print(('^2[forge-npwd-housing]^0 createSystemNotification disparado para %s. Sucesso: %s'):format(street, tostring(ok)))
        if not ok then print('^1[forge-npwd-housing]^0 Erro no createSystemNotification:', tostring(err)) end
    end

    -- 2. Notificação do App Forge NPWD (chamada secundária)
    phoneCall('createNotification', {
        notisId = ('forge-npwd-housing:alarm:%s:%s'):format(propertyId, alarmNotificationSeq),
        appId = 'housing',
        title = '🚨 ALARME RESIDENCIAL',
        content = ('Invasão detectada em %s!'):format(street),
        duration = 10000,
        keepOpen = false,
        path = '/housing',
    })

    -- 3. Som de alerta urgente no frontend do GTA
    PlaySoundFrontend(-1, "Beep_Red", "DLC_HEIST_HACKING_SNAKE_SOUNDS", true)
end)

-- ============================================================================
-- COMANDOS DE TESTE CLIENT-SIDE
-- ============================================================================
RegisterCommand('testalarm', function(source, args)
    local street = (args and #args > 0) and table.concat(args, ' ') or 'South Mo Milton Drive'
    local propertyId = '1'

    print('^2[forge-npwd-housing]^0 =====================================')
    print('^2[forge-npwd-housing]^0 DISPARANDO TESTE DE ALARME LOCAL')
    print(('^3[forge-npwd-housing]^0 Endereço: %s | ID Imóvel: %s'):format(street, propertyId))

    -- Dispara o evento de alerta exatamente como se o servidor tivesse enviado
    TriggerEvent('forge-housing:securityOwnerAlert', propertyId, street)

    -- Também toca o alarme do GTA localmente para teste do som sonoro
    TriggerEvent('forge-housing:client:playResidenceAlarm', propertyId)

    if pr_lib and pr_lib.notify then
        pr_lib.notify({
            title = '🚨 Teste de Alarme',
            description = 'Notificação disparada no celular.',
            type = 'warning'
        })
    end
    print('^2[forge-npwd-housing]^0 =====================================')
end, false)

RegisterCommand('alarme_teste', function(source, args)
    ExecuteCommand('testalarm ' .. (args and table.concat(args, ' ') or ''))
end, false)

RegisterCommand('clearalarm', function()
    TriggerEvent('forge-housing:client:stopResidenceAlarm')
    print('^3[forge-npwd-housing]^0 Alerta e sirene de teste limpos.')
    if pr_lib and pr_lib.notify then
        pr_lib.notify({
            title = 'Alarme Resetado',
            description = 'Sons cancelados.',
            type = 'success'
        })
    end
end, false)

RegisterCommand('limparalarme', function()
    ExecuteCommand('clearalarm')
end, false)


