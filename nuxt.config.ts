// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  css: ["assets/css/global.scss"],
  // mode: 'client' 仅客户端执行 mode: 'server' 仅服务端执行
  plugins: [{ src: "@/plugins/baidu", mode: "client" }],
  devServer: {
    port: 3044,
  }
});
