package com.util;

import java.security.MessageDigest;

import javax.crypto.Cipher;
import javax.crypto.Mac;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.DESedeKeySpec;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;

import org.apache.log4j.Logger;

/**
 * 
 * <p>Title: DESUtil </p>
 * <p>Copyright: Copyright (c) 2015 </p>
 * <p>Description: 加密工具类 </p>
 * 
 * @author LD
 * 
 * @date 2015-08-26
 */
public class EncryptionUtil {

    private static Logger logger = Logger.getLogger(EncryptionUtil.class);

    private static final String MD5 = "MD5";
    private static final String DES = "DES";
    private static final String HMAC_SHA1 = "HmacSHA1";
    private static final String DESEDE = "DESede";

    private static final String CIPHER_ALGORITHM_CBC = "DESede/CBC/PKCS5Padding";

    /**
     * Md5
     * 
     * @param source
     * @return
     * @throws Exception
     */
    public static String md5EncryptOutHex(String source) {
        try {
            MessageDigest md = MessageDigest.getInstance(MD5);
            String md5 = "";
            for (byte b : md.digest(source.getBytes())) {
                String temp = Integer.toHexString(b & 0xff);
                md5 += (temp.length() == 1 ? "0" + temp : temp);
            }
            return md5;
        } catch (Exception e) {
            // This should not happen!
            logger.error(String.format("MD5 EncryptOutHex error: %s", e.getMessage()), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Des
     * 
     * @param key
     * @param source
     * @return
     * @throws Exception
     */
    public static String desEncryptOutHex(String source, String key) {
        try {
            DESKeySpec desKeySpec = new DESKeySpec(key.getBytes("utf-8"));
            SecretKeyFactory skf = SecretKeyFactory.getInstance(DES);
            Cipher cipher = Cipher.getInstance(DES);
            cipher.init(Cipher.ENCRYPT_MODE, skf.generateSecret(desKeySpec));
            return toHex(cipher.doFinal(source.getBytes("utf-8"))).toUpperCase();
        } catch (Exception e) {
            // This should not happen!
            logger.error(String.format("Des EncryptOutHex error: %s", e.getMessage()), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * HmacSHA1
     * 
     * @param source
     * @param key
     * @return
     * @throws Exception
     */
    public static String hmacSHA1EncryptOutHex(String source, String key) {
        try {
            SecretKeySpec signingKey = new SecretKeySpec(key.getBytes("utf-8"), HMAC_SHA1);
            Mac mac = Mac.getInstance(HMAC_SHA1);
            mac.init(signingKey);
            return toHex(mac.doFinal(source.getBytes("utf-8"))).toUpperCase();
        } catch (Exception e) {
            // This should not happen!
            logger.error(String.format("HmacSHA1 EncryptOutHex error: %s", e.getMessage()), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * DESede/CBC/PKCS5Padding
     * 
     * @param source
     * @param key
     * @return
     * @throws Exception
     */
    public static String desedeEncryptOutHex(String source, String key, String iv) {
        try {
            DESedeKeySpec dks = new DESedeKeySpec(key.getBytes("utf-8"));
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DESEDE);
            SecretKey secretKey = keyFactory.generateSecret(dks);

            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM_CBC);

            IvParameterSpec ivSpec = StringUtil.isEmpty(iv) ? null : new IvParameterSpec(iv.getBytes("utf-8"));
            cipher.init(Cipher.ENCRYPT_MODE, secretKey, ivSpec);
            return new String(cipher.doFinal(ByteUtil.hexStringToBytes(source)), "utf-8");
        } catch (Exception e) {
            // This should not happen!
            logger.error(String.format("DESede/CBC/PKCS5Padding EncryptOutHex error: %s", e.getMessage()), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * DESede/CBC/PKCS5Padding
     * 
     * @param source
     * @param key
     * @return
     * @throws Exception
     */
    public static String desedeDecryptOutHex(String source, String key, String iv) {
        try {
            DESedeKeySpec dks = new DESedeKeySpec(key.getBytes("utf-8"));
            SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(DESEDE);
            SecretKey secretKey = keyFactory.generateSecret(dks);

            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM_CBC);

            IvParameterSpec ivSpec = StringUtil.isEmpty(iv) ? null : new IvParameterSpec(iv.getBytes("utf-8"));
            cipher.init(Cipher.DECRYPT_MODE, secretKey, ivSpec);
            return toHex(cipher.doFinal(source.getBytes("utf-8"))).toUpperCase();
        } catch (Exception e) {
            // This should not happen!
            logger.error(String.format("DESede/CBC/PKCS5Padding DecryptOutHex error: %s", e.getMessage()), e);
            throw new RuntimeException(e);
        }
    }

    /**
     * Byte转换为16进制数据
     * 
     * @param bytes
     * @return
     */
    public static String toHex(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            throw new IllegalArgumentException("ToHex encrypt data is null...");
        }
        String value = "", temp = "";
        for (byte b : bytes) {
            temp = Integer.toHexString(b & 0xff);
            value += temp.length() == 1 ? "0" + temp : temp;
        }
        return value;
    }

}
