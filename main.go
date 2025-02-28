import core.http.server
import core.io

server = http.createServer()

server.route("*", "/", func(req, res) {
    core.io.print("So'rov turi: " + req.method)
    core.io.print("URL: " + req.url)
    core.io.print("Headerlar:")
    req.headers.foreach(func(key, value) {
        core.io.print("  " + key + ": " + value)
    })
    core.io.print("Body:")
    core.io.print(req.body)

    res.status(200).send("So'rov qabul qilindi va konsolga chiqarildi.")
})

server.listen("192.168.0.36", 5000, func() {
    core.io.print("Server http://192.168.0.36:5000 da ishlayapti")
})
