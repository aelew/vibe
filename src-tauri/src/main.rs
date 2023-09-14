// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Window;
use tauri_plugin_oauth::{start_with_config, OauthConfig};

#[tauri::command]
async fn start_server(window: Window) -> Result<u16, String> {
    let config = OauthConfig {
        ports: Some(vec![52855]),
        response: Some("All set! You may now close this window.".into()),
    };
    start_with_config(config, move |url| {
        let _ = window.emit("spotify-auth-cb", &url[31..]);
    })
    .map_err(|err| err.to_string())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![start_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
