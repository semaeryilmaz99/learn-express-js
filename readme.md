Bu projeyi express.js öğrenmek amacıyla yaptım. 

ilk etapta npm install express komutunu vererek package.json a express dahil ettim.

server.js oluşturdum ve bu dosyada express framework'ünü projeye dahil ettim.

sonra 
1) routes (APİ endpoint dosyaları), 
2) controllers (iş mantığı yani fonksiyonlar), 
3) models (database modelleri - sql/mongo) 
4) middlewares (auth, loglama, hata yakalama) 
klasörlerini ekledim. 

sonra route oluşturup server.js e dahil ettim.

gizli kalması gereken bilgileri .env içine kaydedip, server.js de dotenv ekleyerek bu bilgileri server.js de değişkenler halinde gösterdim.

models/User.js içinde mongoose ile json şeklinde yazılabilen mongo database şeması oluşturdum ve bu database modülünü diğer dosyalarda kullanabilmek için export ettim.

sonra server.js içinde jwt oluşturarak ile signup-login ve yalnızca o jwt ye özel açılan profil bilgileri için bir protected route tanımladım. 

ayrıca bcrypt lib ekledim ki kullanııc kayıt olurken belirlediği şifre hashlenerek bir değişkende saklansın. 

userRoutes.js içinde CRUD işlemleri için api endpointleri oluşturdum.

server.js içine mongoDB bağlantıısnı ekledim.

mongoDB compass kurulumu yapıp env'deki mongodb uri ile bağladım ve veritabanını görsel olarak inceleyebiliyorum. 