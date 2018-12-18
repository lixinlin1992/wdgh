package com.util;

import java.io.IOException;

import org.apache.log4j.Logger;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 * 
 * <p>Title: JsonMapper </p>
 * <p>Copyright: Copyright (c) 2015 </p>
 * <p>Description: Json数据处理工具类 </p>
 * 
 * @author LD
 * 
 * @date 2015-08-06
 */
public class JsonMapper {

    private static Logger logger = Logger.getLogger(JsonMapper.class);

    private ObjectMapper mapper;

    public JsonMapper() {
        this(null);
    }

    public JsonMapper(Include include) {
        mapper = new ObjectMapper();
        if (include != null) {
            mapper.setSerializationInclusion(include);
        }

        SimpleModule module = new SimpleModule();
        module.addSerializer(String.class, new StringUnicodeSerializer());
        mapper.registerModule(module);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    /**
     * 创建只输出非Null且非Empty(如List.isEmpty)的属性到Json字符串的Mapper,建议在外部接口中使用;
     * 
     * @return
     */
    public static JsonMapper getNonEmptyMapper() {
        return new JsonMapper(Include.NON_EMPTY);
    }

    /**
     * 创建只输出初始值被改变的属性到Json字符串的Mapper, 最节约的存储方式,建议在内部接口中使用;
     * 
     * @return
     */
    public static JsonMapper getNonDefaultMapper() {
        return new JsonMapper(Include.NON_DEFAULT);
    }

    /**
     * 创建默认的Mapper
     * 
     * @return
     */
    public static JsonMapper getInstance() {
        return new JsonMapper().enableSimple();
    }

    /**
     * Object可以是POJO,也可以是Collection或数组; 如果对象为Null, 返回"null"; 如果集合为空集合, 返回"[]";
     * 
     * @return
     */
    public String toJson(Object object) {
        try {
            return mapper.writeValueAsString(object);
        } catch (IOException e) {
            logger.error("Write to json string error:" + object, e);
            return null;
        }
    }

    /**
     * 反序列化POJO或简单Collection如List<String>;
     * 
     * 如果JSON字符串为Null或"null"字符串, 返回Null. 如果JSON字符串为"[]", 返回空集合;
     * 
     * 如需反序列化复杂Collection如List<MyBean>, 请使用fromJson(String, JavaType)
     * 
     * @see #fromJson(String, JavaType)
     */
    public <T> T toObject(String json, Class<T> clazz) {
        if (StringUtil.isEmpty(json)) {
            return null;
        }
        try {
            return mapper.readValue(json, clazz);
        } catch (IOException e) {
            logger.error("Parse json string to object error:" + json, e);
            return null;
        }
    }

    /**
     * 反序列化复杂Collection如List<Bean>, 先使用函数createCollectionType构造类型,然后调用本函数;
     * 
     * @see #createCollectionType(Class, Class...)
     */
    @SuppressWarnings("unchecked")
    public <T> T toObject(String json, TypeReference<?> typeRefer) {
        try {
            if (StringUtil.isEmpty(json)) {
                return null;
            }
            return (T) mapper.readValue(json, typeRefer);
        } catch (IOException e) {
            logger.error("Parse json string to object error:" + json, e);
            return null;
        }
    }

    /**
     * 允许单引号 允许不带引号的字段名称
     * 
     * @return
     */
    public JsonMapper enableSimple() {
        mapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);
        mapper.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        return this;
    }

    /**
     * Get mapper
     * 
     * @return
     */
    public ObjectMapper getMapper() {
        return mapper;
    }

}
