import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default ({ mode }) => {
  return defineConfig({
    base: '/virtual-pilot-frontend/',
    plugins: [react(), basicSsl()],
    assetsInclude: ['**/*.hdr', '**/*.glb'],
    server: {
      port: 8080,
      host: true,
      https: true,
    }
  })
}