# read-felica

## 概要 Summary
 このレポジトリは日本のFelica規格のカードを読み込み、別に指定する save-felica サービスに送信するものである。
 save-felica バックエンドにはHTTPで送信をしている。なお送信時に暗号化はそれ自体ではなされていないためHTTPSになっていない場合は傍受および man in the middle attack の可能性があること注意されたい。
 
 This repository contains a Node.js application that reads a Felica card and sends the data to a backend service, which is ¨save-felica¨.
 Note that the communication between the two are made in HTTP, and the application by itself doesn't support encryption; if you send the data over HTTP instead of HTTPS, you are vulnerable to the man in the middle attack.
 
 
 ## 用意するもの Prerequisites
 <ol>
 <li> Windows machine </li>
 <li> Pasori (RC-S300)</li>
 </ol>
 恐らくMacでも動作すると思われるものの、動作確認はしていない。UbuntuなどはPasoriがドライバを提供していないため、動作確認をしていない。
 
 The program should run on a Mac too, but I didn't test it (...simply because I don't have a Mac).
 As for other OS's such as Ubuntu, the driver is not provided by the manufacturer, and I haven't figured out how to get it working.
 
 ## 手順 How to start the application
 
     git clone https://github.com/ihs-ot-as/read-felica/
     cd read-felica
     npm install
     node .
     
## コマンドオプション Command options
 Commanderを使用して実装されている。最後の
      <code> node . </code>
 のところで指定されたい。
 
 Implemented with Commander. Specify these when you type
     <code> node . </code>
 according to your needs.
 
    -d : バックエンドサーバの場所を指定する。デフォルトでは localhost:5000
    -p : 指定されている場合、HTTPSでの接続をする。デフォルトではHTTP
 
    -d : the location of the backend server, defaults to localhost:5000
    -p : if set the connection will be made in https. Defaults to false.
     
## 中でやっている内容 How does this work
まず、次のQiitaの投稿がなければ作成できなかった。作成者に感謝を述べたい。
[https://qiita.com/gebo/items/cb2dd393170767852fb3](https://qiita.com/gebo/items/cb2dd393170767852fb3)

上記の投稿に書かれている通り、以下2つのAPDUコマンドをカードに送信している。
うち前者でFelicaカード内のサービスの選択、後者で実際の経歴の読み取りを行う。
後ろから二つ目の00のところでpaginationをすることが可能で、読み取れるだけ取得している。

    FF:A4:00:01:02:0F:09
    FF:B0:00:00:00


First of all, this code wouldn't have been possible without this post on Qiita. A huge thank you goes to the poster.
[https://qiita.com/gebo/items/cb2dd393170767852fb3](https://qiita.com/gebo/items/cb2dd393170767852fb3)

To sum up, the program sends two APDU commands to the felica card. The former specifies the service in the card, and the latter actually tells the card to send the data specified.

    FF:A4:00:01:02:0F:09
    FF:B0:00:00:00

The second last 00 is for pagination, so the program increments the page number until it can no longer read out data.


     
     
