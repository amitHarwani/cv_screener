sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"cvscreenerui/test/integration/pages/CandidatesList",
	"cvscreenerui/test/integration/pages/CandidatesObjectPage"
], function (JourneyRunner, CandidatesList, CandidatesObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('cvscreenerui') + '/test/flpSandbox.html#cvscreenerui-tile',
        pages: {
			onTheCandidatesList: CandidatesList,
			onTheCandidatesObjectPage: CandidatesObjectPage
        },
        async: true
    });

    return runner;
});

