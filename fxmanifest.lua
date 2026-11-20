fx_version 'cerulean'
game 'gta5'
lua54 'yes'

name 'forge-npwd-housing'
author 'ForgeBox'
description 'Housing system App for Forge NPWD Phone'

shared_scripts {
    '@pr_bridge/init.lua',
    '@forge-npwd/compat/app.lua',
}

-- Legacy dependency names; export routing remains inside forge-npwd.
provide 'npwd-forge-housing'
provide 'npwd_forge_housing'

client_script 'client/client.lua'
dependency 'forge-npwd'
server_script 'server/server.lua'

ui_page 'web/dist/index.html'

files {
    'web/dist/index.html',
    'web/dist/**/*',
}

version '1.0.2'

server_script 'server/version.lua'
