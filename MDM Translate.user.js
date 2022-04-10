// ==UserScript==
// @name         MDM 翻译
// @description  Master Duel Meta 卡片名称、效果翻译
// @version      0.1
// @author       Fwindy
// @match        https://www.masterduelmeta.com/*
// @icon         https://www.google.com/s2/favicons?domain=masterduelmeta.com
// @namespace    https://github.com/Fwindy
// @connect      ygocdb.com
// @grant        GM_xmlhttpRequest
// @grant        window.onurlchange

// ==/UserScript==

(function () {
    "use strict";
    onload = () => {
        translate();
        const observer = new MutationObserver(tooltipTranslate);
        const config = {
            attributes: false,
            childList: true,
            characterData: false,
        };
        observer.observe(document.querySelector("#tooltip-root"), config);
    };
    if (window.onurlchange === null) {
        window.addEventListener("urlchange", translate);
    }

    function translate() {
        if (location.href.match(/masterduelmeta.com\/cards/)?.length > 0) {
            const hrefName = decodeURIComponent(
                decodeURI(/([^\/]*)$/.exec(location.href)[0])
            );
            const cardName = document.getElementsByClassName("h1")[0];
            const cardType =
                document.getElementsByClassName("monster-types")[0];
            const cardDescription =
                document.getElementsByClassName("card-desc")[0];

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ygocdb.com/api/v0/?search=" + hrefName,
                responseType: "json",
                onload: function (r) {
                    if (r.status === 200) {
                        const result = r.response.result.filter(
                            (x) => x.en_name === hrefName
                        )[0];
                        cardName.innerText = result.cn_name;
                        if (cardType?.innerText)
                            cardType.innerText = /^[^\/]*/.exec(
                                result.text.types
                            )[0];
                        cardDescription.innerText = result.text.desc;
                    }
                },
            });
        }
    }

    function tooltipTranslate() {
        const cardName = document.querySelector(
            "#tooltip-root div.card-specs > div.spec-container > span > b"
        );
        const cardType = document.querySelector("#tooltip-root span.monster-types > b");
        const cardDescription = document.querySelector("#tooltip-root span.card-desc");
        if (cardName?.innerText) {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://ygocdb.com/api/v0/?search=" + cardName.innerText,
                responseType: "json",
                onload: function (r) {
                    if (r.status === 200) {
                        const result = r.response.result.filter(
                            (x) => x.en_name === cardName.innerText
                        )[0];
                        if (result?.cn_name) {
                            cardName.innerText = result.cn_name;
                            if (cardType)
                                cardType.innerText = /^[^\/]*/.exec(
                                    result.text.types
                                )[0];
                            cardDescription.innerText = result.text.desc;
                        }
                    }
                },
            });
        }
    }
})();
