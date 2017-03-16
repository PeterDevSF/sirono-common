({
	doCmpInit: function(cmp, e, hlpr) {
		var PaymentInfo = cmp.get('v.PaymentInfo');

		var cardId = cmp.get('v.PaymentInfo.paymentPlan.Payment_Method__c');
		var CreditCard = hlpr.getDefaultCard();

		if (PaymentInfo && PaymentInfo.creditCards.length) {
			PaymentInfo.creditCards.forEach(function(card) {
				if (card.sfId === cardId) {
					CreditCard = card;
				}
			});
		}

		cmp.set('v.selectedCardId', cardId);
		cmp.set('v.CreditCard', CreditCard);
	},

	initCardSelectOptions: function(cmp, e, hlpr) {
		var PaymentInfo = cmp.get('v.PaymentInfo');
		var cardSelection = cmp.find('state');
		console.log('PaymentInfo' , PaymentInfo);
		console.log('cardSelection' , cardSelection);
		cardSelection.set('v.body', []);
		var body = cardSelection.get('v.body');
		PaymentInfo.creditCards.forEach(function(card){
			$A.createComponent(
				'aura:html',
				{
					tag: 'option',
					HTMLAttributes: {
						value: card.sfId,
						text: card.displayName
					}
				},
				function(newOption){
					if(cmp.isValid()){
						body.push(newOption);
						cardSelection.set('v.body', body);
					}
				})
		});
	},

	cancelAction: function (cmp, e, hlpr) {
		cmp.getEvent('initPlanInfo').fire();
	},
	changeCard: function(cmp, e, hlpr) {
		var cardId = cmp.get('v.selectedCardId');
		var PaymentInfo = cmp.get('v.PaymentInfo');
		var CreditCard = {};
		if (PaymentInfo && PaymentInfo.creditCards.length) {
			PaymentInfo.creditCards.forEach(function(card) {
				CreditCard = card;
				if (card.sfId === cardId) {
					CreditCard = card;
				}
			});
		}
		cmp.set('v.CreditCard', CreditCard);
	},
	editCreditCard: function(cmp, e, hlpr) {
		e.stopPropagation();
		//Temporary solution
		cmp.set('v.CreditCard', hlpr.getDefaultCard());
		$A.util.toggleClass(cmp.find('editPaymentMethod'), 'slds-hide');
		$A.util.toggleClass(cmp.find('editCreditCard'), 'slds-hide');
		return false;
	},
	addNewCreditCard: function(cmp, e, hlpr) {
		e.stopPropagation();

		cmp.set('v.CreditCard', hlpr.getDefaultCard());

		$A.util.toggleClass(cmp.find('editPaymentMethod'), 'slds-hide');
		$A.util.toggleClass(cmp.find('editCreditCard'), 'slds-hide');
		return false;
	},
	cancelEditCardAction: function(cmp, e, hlpr) {
		e.stopPropagation();

		$A.util.toggleClass(cmp.find('editPaymentMethod'), 'slds-hide');
		$A.util.toggleClass(cmp.find('editCreditCard'), 'slds-hide');
	},

	setupPlan: function(cmp, e, hlpr) {
		console.log('setUpPlan');
		cmp.set('v.hasError', false);
		var PaymentRequestInfo = cmp.get('v.PaymentRequestInfo');
		console.log('PRI', PaymentRequestInfo);
		var CreditCard = cmp.get('v.CreditCard');
		console.log('CC:', CreditCard);
		PaymentRequestInfo.creditCard = CreditCard;

		var createPlan = cmp.get('c.addToPaymentPlan');
		createPlan.setCallback(this, function(response) {
			if (response.getState() === 'SUCCESS') {
				var appEvent = $A.get("e.c:switchTab");
				appEvent.setParams({ "tabName" : 'CreatePaymentPlan'});
				appEvent.fire();
				
				setTimeout(function() { 
					var plan = response.getReturnValue();
					cmp.getEvent('updatePaymentMethod').fire();
					return;
				}, 2500);

				
			}

			var errors = response.getError();
			console.log('errors', errors);
			if (errors) {
				hlpr.showError(cmp, errors? errors[0].message : 'Error has been occurred');
			}
		});
		$A.enqueueAction(createPlan);
	},

	updatePaymentMethod: function(cmp, e, hlpr) {
		cmp.set('v.hasError', false);
		var PaymentRequestInfo = cmp.get('v.PaymentRequestInfo');
		var CreditCard = cmp.get('v.CreditCard');
		PaymentRequestInfo.creditCard = CreditCard;
		console.info('Update Payment Plan: info', JSON.parse(JSON.stringify(PaymentRequestInfo)));

		var createPlan = cmp.get('c.doEditPaymentMethod');
		createPlan.setParams({
			'paymentInfoStr': JSON.stringify( PaymentRequestInfo )
		});
		createPlan.setCallback(this, function(response) {
			if (response.getState() === 'SUCCESS') {
				var plan = response.getReturnValue();
				console.log('responseresponse: ' , plan);
				cmp.getEvent('updatePaymentMethod').setParams({
					paymentPlan: plan,
					isEditTerms: true
				}).fire();
				return;
			}

			var errors = response.getError();
			if (errors) {
				hlpr.showError(cmp, errors? errors[0].message : 'Error has been occurred');
			}
		});
		$A.enqueueAction(createPlan);
	}
})