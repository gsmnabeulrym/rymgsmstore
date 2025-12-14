$body = @{
    name = "SAMSUNG GALAXY A16"
    brand = "SAMSUNG"
    price = 0
    category = "smartphones"
    description = "Ecran 6.7 pouces Super AMOLED FHD+ (2340x1080px). Processeur Octa-core. Systeme d'exploitation Android. Mémoire RAM 16Go (extension RAM 8+8 Go). Stockage 256Go. Appareil photo Arrière Trio 50MP + 5MP + 2MP. Appareil Photo Frontale 13MP. Connectivité 4G, Wifi et Bluetooth 5.3. Double SIM. Capacite de la batterie 5000 mAh. Empreinte digitale. NFC. Garantie 1 an."
    images = @()
    specs = @{
        "Ecran" = "6.7 pouces Super AMOLED FHD+ (2340x1080px)"
        "Processeur" = "Octa-core"
        "Systeme" = "Android"
        "RAM" = "16Go (extension RAM 8+8 Go)"
        "Stockage" = "256Go"
        "Camera Arriere" = "Trio 50MP + 5MP + 2MP"
        "Camera Frontale" = "13MP"
        "Batterie" = "5000 mAh"
        "Connectivite" = "4G, Wifi et Bluetooth 5.3"
        "SIM" = "Double SIM"
        "Securite" = "Empreinte digitale, NFC"
        "Garantie" = "1 an"
    }
} | ConvertTo-Json -Depth 3

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/products" -Method POST -Body ([System.Text.Encoding]::UTF8.GetBytes($body)) -ContentType "application/json; charset=utf-8"
Write-Output $response
