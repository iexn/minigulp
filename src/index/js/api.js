//= extend common/api.js

// ^ block:main
const urls = {
    approval: config.API_PATH + "/approval.json",
};

api.approval = function (data, done, fail) {
    api.request(urls.approval, data, {
        done,
        fail
    });
};
// $ block:main