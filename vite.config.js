import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default ({ mode }) => {
  return defineConfig({
    plugins: [react(), basicSsl()],
    assetsInclude: ['**/*.hdr', '**/*.glb'],
    server: {
      port: 8080,
      host: true,
      https: true,
      // proxy: {
      //   '/socket.io': {
      //     target: 'https://virtual-pilot.loca.lt',
      //     // changeOrigin: true,
      //     rewriteWsOrigin: true,
      //     ws: false
      //   }
      // }
    }
  })
}