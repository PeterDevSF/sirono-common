/*
 * Copyright (c) 2017-present Sirono LLC, All rights reserved
 */

/**
 * This Wrapper class is use to check how many Encounters select or which encounter select for Payment Process.
 **/
global class EncounterWrapper {
    global Encounter__c en { get; set; }
    global Boolean isSelected { get; set; }

	/**
	 * This method is use to get Encounter Records based on Guarantor Id or Id and Balance is greater than zero.
	 * These records add into List of Encounter Wrapper Class.
	 * @param List<Encounter__c> encounterList - list of encounters
	 * @return List<EncounterWrapper> - list of encounter wrapper records
	 **/
    global static List<EncounterWrapper> buildList(List<Encounter__c> encounterList) {
        List<EncounterWrapper> encounters = new List<EncounterWrapper>();
        if (!encounterList.isEmpty()) {
            for (Encounter__c en : encounterList) {
                encounters.add(new EncounterWrapper(en, false));
            }
        }

        return encounters;
    }

	/**
	 * Constructor of Wrapper Class.
	 *
	 * @param Encounter__c en - encounter record
	 * @param Boolean isSelected - check if record is selected or not
	 **/
    global EncounterWrapper(Encounter__c en, Boolean isSelected) {
        this.en = en;
        this.isSelected = isSelected;
    }
}