import apiClient from '@/api/http'
import forge from 'node-forge'

let cachedPublicKey = ''

const getPublicKey = async () => {
  if (cachedPublicKey) return cachedPublicKey
  const res = await apiClient.get<{ publicKey: string }>('/crypto/public-key')
  cachedPublicKey = res.publicKey
  return cachedPublicKey
}

export const encryptPassword = async (password: string) => {
  if (!password) return ''
  const publicKey = await getPublicKey()
  const key = forge.pki.publicKeyFromPem(publicKey)
  const encrypted = key.encrypt(forge.util.encodeUtf8(password), 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: {
      md: forge.md.sha256.create(),
    },
  })
  return `rsa:${forge.util.encode64(encrypted)}`
}
