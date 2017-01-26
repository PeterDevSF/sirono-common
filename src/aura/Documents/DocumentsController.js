({
	doInit : function(component, event, helper) {
		helper.getDocuments(component);
	},

	updateSorting : function(component, event, helper) {

		var arrowUse = event.currentTarget.querySelector('svg').querySelector("use");
		var orderType = '';
		var arrowPath = arrowUse.getAttribute('href');
		if (arrowPath.includes('arrowdown')) {
			orderType = 'ASC';
			arrowPath = arrowPath.replace('arrowdown', 'arrowup');
		} else {
			orderType = 'DESC';
			arrowPath = arrowPath.replace('arrowup', 'arrowdown');
		}
		arrowUse.setAttribute('href', arrowPath);

		var orderCriteria = event.currentTarget.dataset.orderType;
		helper.updateSorting(component, orderCriteria, orderType);
		this.superRerender();
	},
    showPopoverRight : function(component, event, helper) {
		var myPopoverRight = component.find('sldsjsPopoverRight');
		$A.util.toggleClass(myPopoverRight, 'slds-hide');         
	},
	changeArrow: function(event) {
		return true;
	}
})