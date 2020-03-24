export default function({ $axios, store, error, $notifier, app }) {
  $axios.onRequest(config => {
    config.headers.common["token"] = store.getters["auth/GET_TOKEN"];
    config.baseURL = process.env.API_URL;
  });

  $axios.onError(err => {
    if (!err.response) {
      error({
        statusCode: 501,
        message: "Ведутся технические работы, попробуйте заново позднее"
      });
      app.$notifier.showMessage({ message: "Отсутствует подключение к серверу", type: "error" });
    } else app.$notifier.showMessage({ message: err.response.data.error, type: "error" });
  });
}
