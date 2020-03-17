let Base = JSON.parse(sessionStorage.baseUser);

return {
    DEFAULT_AVATAR : "/shijiwxy/weixin/images/defaultHead.jpg",
    API_BASE_URL   : domainName,
    TOKEN          : Base.token,
    UDID           : Base.udid,
    USER_ID        : Base.orguser.user_id,
    ORG_ID         : Base.orguser.org_id,
    VERSION        : baseParameter.version,
};
