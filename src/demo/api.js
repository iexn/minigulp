(function () {
    const urls = {
        list: "",
    };

    api.list = function ({id}, callback, fail) {
        api.request(urls.list, {
            gradeId: id
        }, {
            done(result) {
                callback && callback({
                    message: result.message,
                    data: result.data
                });
            },
            fail(e) {
                fail && fail({
                    message: e.message || "获取失败"
                });
            }
        });
    }

});
