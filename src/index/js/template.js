const template = {
    // 标题
    header: `<div class="msg">
        <h3 class="msg-title">${lang("__LOGIN_TITLE__")}</h3>
        <p class="msg-warn-tips"><img src="./assets/icon/error.png" class="tips-icon" alt="" srcset=""><i>${lang("__LOGIN_ERROR__")}</i></p>
        <p class="msg-warn-text">${lang("__MSG_WARN__")}</p>
    </div>`,
    // 承包密码表单box
    passwords: `<div class="password-form"></div>`,
    // 密码表单
    passwordForm: `<form action="javascript:;" method="post"></form>`,
    // 表单控制
    fieidset: `<fieldset></fieldset>`,
    // 填写格式正确对勾
    whiteSuccess: `<span><img src="./assets/icon/pass.png" class="pass-icon"/></span>`,
    // 承包表单验证tips
    fditLineTips: `<div class="editline-tips"></div>`,
    // 提交按钮
    submit: `<div class="form-line">
        <button type="submit" class="button button-fill external">${lang("__SAVE_AND_RELOGIN__")}</button>
    </div>`,
    // 表单行，单行
    formLine: `<div class="form-line">
        <div class="editline">
            <span class="editline-title">{{title}}</span>
            <span class="editline-items"><input type="password" name="{{name}}" value="{{value}}" class="form-line-input" placeholder="{{placeholder}}" maxlength="16" autocomplete="off"></span>
        </div>
    </div>`,
    // 表单提示行，单行
    formItemTip: `<p><img src="./assets/icon/{{type}}.png" class="tips-icon" alt="" srcset=""><i class="tip-text">{{text}}</i></p>`,
    // loading
    loadingFont: `<i class="fa fa-spin fa-spinner"></i> `
};
