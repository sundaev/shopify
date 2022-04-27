const activityDiscountCartTemplate = document.createElement("template");
activityDiscountCartTemplate.innerHTML = `
<style>
  .activity-content-cart {
  border-bottom: 1px solid #F2F2F2;
  margin: 0 20px 26px 0 ;
  padding-top: 8px;
}

.activity-content-cart .acitvity-wrapper {
  position: relative;
  display: flex;
  line-height: 1.4;
}

.activity-content-cart .activity__info {
  position: relative;
  display: flex;
  margin-bottom: 10px;
  line-height: 1.4;
}

.activity-content-cart .acitvity-wrapper &::before {
  border-radius: 5px;
  color: #fff;
  background: rgba(0,0,0,.7);
  top: -43px;
  margin-bottom: 17px;
  left: 0;
}

.activity-content-cart  .acitvity-text {
  display: inline-block;
  max-width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-content-cart .acitvity-copy {
  display: inline-block;
  margin-left: 10px;
  color: #6AB3FF;
  cursor: pointer;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
}

.activity-content-cart .acitvity-copy  &:hover {
  opacity: 0.8
}
.activity-content-cart .acitvity-copy  &:active {
  opacity: 1
}

.activity-content-cart  .acitvity-code {
  display: inline-block;
  background: #FBE8C8;
  color: #333;
  padding: 0px 5px;
  margin-left: 10px;
}

.activity-icon {
}
.activity-icon.pro-label {
    font-size: 16px;
    color: #333;
  }
.activity-icon.shipping-car {
    font-size: 20px;
    color: #333;
}

.acitvity-inner-content-cart {
  display: flex;
  flex-direction: column;
}

.acitvity-inner-content-cart > div {
  display: flex;
  margin-bottom: 8px;
  position: relative;
}

@media (-moz-touch-enabled: 0), (hover: hover) {
  [data-tooltip] {
    position: relative;
  }
  
  [data-tooltip]::before {
      position: absolute;
      content: attr(data-tooltip);
      bottom: 100%;
      left: 0;
      padding: 4px 11px 3px 11px;
      white-space: nowrap;
      border: 1px solid #e7e7e7;
      background: rgba(0,0,0,.7);
      color: #fff;
      font-size: 12px;
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
      -webkit-transition: visibility 0.2s ease-in-out, opacity 0.2s ease-in-out;
      transition: visibility 0.2s ease-in-out, opacity 0.2s ease-in-out;
      z-index: 1;
    }

  [data-tooltip]:hover::before {
      opacity: 1;
      visibility: visible;
    }
}

.data-tooltip {
  position: absolute;
  bottom: 100%;
  left: 0;
  padding: 4px 11px 3px 11px;
  white-space: nowrap;
  border: 1px solid #e7e7e7;
  background: rgba(0,0,0,.7);
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  visibility: hidden;
  opacity: 0;
  -webkit-transition: visibility 0.2s ease-in-out, opacity 0.2s ease-in-out;
  transition: visibility 0.2s ease-in-out, opacity 0.2s ease-in-out;
  z-index: 1;
}

</style>
<div id="activity-content-cart" class="activity-content-cart">
  <div class="acitvity-wrapper">
      <div class="acitvity-inner-content-cart">
      </div>
  </div>
</div>
`;
class ActivityDiscountCart extends HTMLElement {
  get show() {
    return this.getAttribute("show") === 'true' ? true : false;
  }
  get content() {
    return this.getAttribute("content");
  }

  element;

  constructor() {
    super();
    var shadow = this.attachShadow({ mode: 'open' });
    if (this.show) {
      this.element = activityDiscountCartTemplate.content.cloneNode(true);
      this.handle();
      shadow.appendChild(this.element);
    }
  }

  handle() {
    const activityContent = this.content;
    console.log(this.element.querySelector(".acitvity-inner-content-cart"));
    activityContent
      .replace(/\n|\r/g, "#@@#")
      .split("#@@#")
      .forEach((v) => {
        const code = v.substring(v.indexOf("[") + 1, v.indexOf("]"));
        const text = v.indexOf("[") > -1 ? v.substring(0, v.indexOf("[")) : v;
        this.element.querySelector(".acitvity-inner-content-cart").appendChild(
          this.createActityBox({
            code,
            text,
          })
        );
      });
  }

  copyCodeFromPro(value) {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.setAttribute("value", value);
    input.select();
    if (document.execCommand("copy")) {
      console.log("复制成功");
    }
    document.body.removeChild(input);
  }

  createActityBox(activity) {
    const div = document.createElement("div");
    div.setAttribute("data-tooltip", activity.text);
    div.appendChild(this.createDataTooltipForMobile(activity.text));
    let copy;
    let code;
    const text = document.createElement("span");
    text.className = "acitvity-text";
    text.innerText = activity.text;
    if (activity.code) {
      code = document.createElement("span");
      copy = document.createElement("span");
      code.className = "acitvity-code";
      code.innerText = activity.code;
      copy.className = "acitvity-copy";
      copy.innerText = "COPY";
      copy.addEventListener('click', () => {
        this.copyCodeFromPro(activity.code);
        this.handleDataTooltip(
          div.querySelector(".data-tooltip"),
          "show",
          `COPY SUCCEEDED!`
        );
        div.setAttribute("data-tooltip", `COPY SUCCEEDED!`);
        setTimeout(() => {
          div.setAttribute("data-tooltip", activity.text);
          this.handleDataTooltip(
            div.querySelector(".data-tooltip"),
            "hide",
            "COPY SUCCEEDED!"
          );
        }, 500);
      });
    }
    div.appendChild(text);
    code && div.appendChild(code);
    code && div.appendChild(copy);
    return div;
  }

  /*
   * 为适应手机端，创建一个data-tooltip的标签存放提示信息
   */
  createDataTooltipForMobile(tooltipText) {
    const spanDataToolTip = document.createElement("span");
    spanDataToolTip.className = "data-tooltip";
    spanDataToolTip.textContent = tooltipText;
    return spanDataToolTip;
  }

  /*
   * 控制data-tooltip显示隐藏
   */
  handleDataTooltip(el, type, text) {
    if (type === "hide") {
      el.style.opacity = 0;
      el.style.visibility = "hidden";
    } else {
      el.style.opacity = 1;
      el.style.visibility = "visible";
    }
    el.textContent = text;
  }
}
window.customElements.define("activity-discount-cart", ActivityDiscountCart);
