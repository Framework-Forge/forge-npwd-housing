-- forge-npwd-housing | server.lua
-- pr_lib disponível globalmente via @pr_bridge/init.lua (shared_scripts)
-- Zero dependências externas (sem qb-core, sem oxmysql)
-- Comunicação com forge-housing é feita via pr_lib.callback pelo client.lua

CreateThread(function()
    print('^2[forge-npwd-housing]^0 Server inicializado com pr_bridge. pr_lib ativo: ' .. tostring(pr_lib ~= nil))
end)

pr_lib.callback.register('forge-npwd-housing:server:getPhoneOwner', function(source)
    local owner = pr_lib.phone and pr_lib.phone.GetActiveOwnerIdentifier
        and pr_lib.phone.GetActiveOwnerIdentifier(source)
        or nil
    return owner and tostring(owner) or nil
end)

-- ============================================================================
-- CALLBACK: dispatchPolice
-- Permite ao proprietário despachar a polícia (10-90) pelo celular
-- ============================================================================
pr_lib.callback.register('forge-npwd-housing:server:dispatchPolice', function(source, propertyId)
    propertyId = tostring(propertyId)
    if not propertyId or propertyId == '' then
        return false, 'ID do imóvel inválido.'
    end

    local success, result = pcall(function()
        return pr_lib.housing.DispatchPoliceForProperty(propertyId, source)
    end)

    if success and result == true then
        return true, 'Polícia acionada com sucesso! Código 10-90 despachado.'
    end

    return false, 'Nenhum policial em serviço no momento ou falha no despacho.'
end)
