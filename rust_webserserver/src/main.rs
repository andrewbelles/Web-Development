use std::fs;
use actix_files::Files;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use serde::{Deserialize, Serialize}; 
//use html_escape::encode_text;

#[get("/")]
async fn form() -> impl Responder {
    match fs::read_to_string("static/index.html") {
        Ok(html) => HttpResponse::Ok()
            .content_type("text/html; charset=utf-8")
            .body(html),
        Err(_) => HttpResponse::InternalServerError()
            .body("Error reading index.html"),
    }
}

#[derive(Deserialize)]
struct InputData {
    user_input: String,
}

#[derive(Serialize)]
struct OutputData {
    echoed: String,
}

#[post("/echo")]
async fn echo(input: web::Json<InputData>) -> impl Responder {
    let response = OutputData {
        echoed: input.user_input.clone(),
    };
    HttpResponse::Ok().json(response)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(echo)
            .service(Files::new("/", "./static")
                .index_file("index.html")
            )
        })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
