// 七千牛配置
const qiniu = require('qiniu')
const AccessKey = 'mh44KOfH3UDGtGqnZtNqbEMzKnstTWUv9mRDTqGp';
const SecretKey = '5GYYo5SZyva18bt-51NXqgtGoC5y7eEkDCxRs3z0';
const qiniuBucket = 'cartoon-img';  //桶名
// 上传凭证

const mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey)
function generateToken() {
    const options = {
        scope:qiniuBucket,
        expires: 3600 // 设置 Token 有效期，单位秒
    };
    // 生成token
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const token = putPolicy.uploadToken(mac);

    return token;
}

// 更新token
function refreshAndSetToken() {
    const token = generateToken();
    return token;
}




module.exports = {
    generateToken,
    refreshAndSetToken
}