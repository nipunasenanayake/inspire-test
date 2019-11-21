
// Load the Google Analytics script
if(!window.ga){
	(function(i,s,o,g,r,a,m){ i['GoogleAnalyticsObject']=r;	i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();
	a=s.createElement(o), m=s.getElementsByTagName(o)[0]; a.async=1; a.src=g; m.parentNode.insertBefore(a,m)
	})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
}

// Standard Google Analytics call for each page
ga('create', 'UA-368058-1', 'auto', {'name': 'urcmTracker'});
ga('urcmTracker.send', 'pageview');


(function ($) {
	Drupal.urcm_analytics = {};
	Drupal.urcm_analytics.downloadExtensions = "pdf|docx";

	$(document).ready(function() {
		// Attach mousedown, keyup, touchstart events to document to catch clicks on page elements
		$(document.body).bind("mousedown keyup touchstart", function(event) {

		// Catch the closest surrounding link of a clicked element.
			$(event.target).closest("a,area").each(function() {
				// Is the clicked URL internal?
				if (Drupal.urcm_analytics.isInternal(this.href)) {
					// Track Downloads
					if (Drupal.urcm_analytics.isDownload(this.href)) {
						ga('urcmTracker.send', "event", "Downloads", Drupal.urcm_analytics.getDownloadExtension(this.href).toUpperCase(), Drupal.urcm_analytics.getPageUrl(this.href));
					}
					// Track Internal Pages
					else if (Drupal.urcm_analytics.isInternalSpecial(this.href)) {
						ga('urcmTracker.send', "pageview", { "page": Drupal.urcm_analytics.getPageUrl(this.href) });
					}
				} else {
					// Track Mailtos
					if ($(this).is("a[href^='mailto:'],area[href^='mailto:']")) {
						ga('urcmTracker.send', "event", "Mails", "Click", this.href.substring(7));
					}
				
					// Track outbound links
					else if (this.href.match(/^\w+:\/\//i)) {
						ga('urcmTracker.send', "event", "Outbound links", "Click", this.href);
					}
				}
			});
		});
	});

	Drupal.urcm_analytics.isDownload = function (url) {
		var isDownload = new RegExp("\\.(" + Drupal.urcm_analytics.downloadExtensions + ")([\?#].*)?$", "i");
		return isDownload.test(url);
	};

	Drupal.urcm_analytics.isInternal = function (url) {
		var isInternal = new RegExp("^(https?):\/\/" + window.location.host, "i");
		return isInternal.test(url);
	};

	Drupal.urcm_analytics.isInternalSpecial = function (url) {
		var isInternalSpecial = new RegExp("(\/go\/.*)$", "i");
		return isInternalSpecial.test(url);
	};

	Drupal.urcm_analytics.getPageUrl = function (url) {
		var extractInternalUrl = new RegExp("^(https?):\/\/" + window.location.host, "i");
		return url.replace(extractInternalUrl, '');
	};

	Drupal.urcm_analytics.getDownloadExtension = function (url) {
		var extractDownloadextension = new RegExp("\\.(" + Drupal.urcm_analytics.downloadExtensions + ")([\?#].*)?$", "i");
		var extension = extractDownloadextension.exec(url);
		return (extension === null) ? '' : extension[1];
	};
})(jQuery);