/*
 * Copyright (c) 2017-present Sirono LLC, All rights reserved
 */

({
    activateTab: function (component, event, helper) {
        var tabToActivate = event.target.id,
            activeTab = component.get("v.activeTab"),
            appEvent;

        if (activeTab !== tabToActivate) {
            if (activeTab) {
                $A.util.addClass(component.find(activeTab), 'display_false');
                $A.util.removeClass(component.find(activeTab + '_tab'), 'active');
            }
            $A.util.removeClass(component.find(tabToActivate), 'display_false');
            $A.util.addClass(component.find(tabToActivate + '_tab'), 'active');
            component.set("v.activeTab", tabToActivate);
            appEvent = $A.get("e.c:switchTab");
            appEvent.setParams({"tabName": component.get('v.activeTab')});
            appEvent.fire();
        }

    },

    doInit: function (cmp, e, hlpr) {
        var activeTab = cmp.get("v.activeTab"),
            checkPPAction;

        if (!activeTab || activeTab === 'MakeAPayment') {
            //set default value
            cmp.set("v.activeTab", "MakeAPayment");
        } else {
            $A.util.removeClass(cmp.find('MakeAPayment' + '_tab'), 'active');
            $A.util.addClass(cmp.find('MakeAPayment'), 'display_false');
            $A.util.addClass(cmp.find(activeTab + '_tab'), 'active');
            $A.util.removeClass(cmp.find(activeTab), 'display_false');
        }

        checkPPAction = cmp.get("c.getPaymentPlanInfo");
        checkPPAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                try {
                    var paymentInfo = response.getReturnValue(),
                        PaymentRequestInfo = hlpr.getInitPaymentRequestInfo(paymentInfo);
                    cmp.set('v.PaymentInfo', paymentInfo);
                    cmp.find('paymentPlanCmp').doCmpInit(paymentInfo, PaymentRequestInfo);
                } catch (e) {
                    console.log(e);
                }
            }
        });
        $A.enqueueAction(checkPPAction);
    },

    changePaymentBalance: function (cmp, e, hlpr) {
        var params = e.getParams();
        try {
            var paymentInfo = cmp.get('v.PaymentInfo'),
                PaymentRequestInfo;
            if (paymentInfo) {
                paymentInfo = hlpr.getAdjustedPaymentInfo(paymentInfo, params);

                PaymentRequestInfo = hlpr.getInitPaymentRequestInfo(paymentInfo);
                PaymentRequestInfo.totalAmount = params.paymentBalance || PaymentRequestInfo.totalAmount;
                cmp.set('v.PaymentInfo', paymentInfo);
                cmp.find('paymentPlanCmp').doCmpInit(paymentInfo, PaymentRequestInfo);
            }
        } catch (e) {
            console.log(e);
        }
    }
})