using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Cryptography
{
    using System.Security.Cryptography;
    using System.IO;
    using Utils;
    class AESEncryptDecrypt
    {
        public static string AESEncrypt(string input, string key, string iv)
        {
            try
            {
                byte[] bytesToBeEncrypted = Encoding.UTF8.GetBytes(input);
                byte[] bytesEncrypted = AESEncrypt(bytesToBeEncrypted, key, iv);
                string result = Convert.ToBase64String(bytesEncrypted);
                return result;
            }
            catch (Exception ex)
            {
                string str = ex.ProcessException();
                return "";
            }
        }
        public static string AESDecrypt(string input, string key, string iv)
        {
            byte[] bytesToBeDecrypted = Convert.FromBase64String(input);
            byte[] bytesDecrypted = AESDecrypt(bytesToBeDecrypted, key, iv);
            string result = Encoding.UTF8.GetString(bytesDecrypted);
            return result;
        }
        public static byte[] AESEncrypt(byte[] bytesToBeEncrypted, string key, string iv)
        {
            byte[]? encryptedBytes = null;
            using (MemoryStream ms = new MemoryStream())
            {
                using (Aes AES = Aes.Create())
                {
                    AES.KeySize = BasicAction.KeySize;
                    AES.BlockSize = BasicAction.BlockSize;
                    AES.FeedbackSize = BasicAction.FeedbackSize;

                    AES.Key = System.Text.Encoding.UTF8.GetBytes(key);
                    AES.IV = System.Text.Encoding.UTF8.GetBytes(iv);

                    AES.Mode = CipherMode.CBC;
                    AES.Padding = PaddingMode.PKCS7;

                    using (var cs = new CryptoStream(ms, AES.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(bytesToBeEncrypted, 0, bytesToBeEncrypted.Length);
                        cs.Close();
                    }
                    encryptedBytes = ms.ToArray();
                }
            }
            return encryptedBytes;
        }
        public static byte[] AESDecrypt(byte[] bytesToBeDecrypted, string key, string iv)
        {
            byte[]? decryptedBytes = null;

            using (MemoryStream ms = new MemoryStream())
            {
                using (Aes AES = Aes.Create())
                {
                    AES.KeySize = BasicAction.KeySize;
                    AES.BlockSize = BasicAction.BlockSize;
                    AES.FeedbackSize = BasicAction.FeedbackSize;

                    AES.Mode = CipherMode.CBC;
                    AES.Padding = PaddingMode.PKCS7;


                    AES.Key = System.Text.Encoding.UTF8.GetBytes(key);
                    AES.IV = System.Text.Encoding.UTF8.GetBytes(iv);


                    using (var cs = new CryptoStream(ms, AES.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(bytesToBeDecrypted, 0, bytesToBeDecrypted.Length);
                        cs.Close();
                    }
                    decryptedBytes = ms.ToArray();
                }
            }

            return decryptedBytes;
        }
    }
}
