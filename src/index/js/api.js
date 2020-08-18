Object.assign(Package.api, (function () {
    const urls = {
        check: "/approval.json",
    };
    
    api.approval = function (data, done, fail) {
        api.request(urls.approval, data, {
            done,
            fail
        });
    };
})());
