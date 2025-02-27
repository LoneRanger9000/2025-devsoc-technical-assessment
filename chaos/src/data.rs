use axum::{http::StatusCode, response::IntoResponse, Json};
use serde::{Deserialize, Serialize};

pub async fn process_data(Json(request): Json<DataRequest>) -> impl IntoResponse {
    // Calculate sums and return response
    let mut int_sum: i64 = 0;
    let mut str_sum: usize = 0;

    // Going through each element and incrementing the relevant variable
    for item in request.data {
        match item {
            serde_json::Value::Number(num) => int_sum += num.as_i64().unwrap(),
            serde_json::Value::String(str) => str_sum += str.len(),
            _ => continue,
        }
    }

    // Sorting and returning the results
    let response = DataResponse {
        string_len: str_sum,
        int_sum: int_sum,
    };

    (StatusCode::OK, Json(response))
}

#[derive(Deserialize)]
pub struct DataRequest {
    data: Vec<serde_json::Value>,
}

#[derive(Serialize)]
pub struct DataResponse {
    string_len: usize,
    int_sum: i64,
}
