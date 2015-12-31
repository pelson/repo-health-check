// Generated by CoffeeScript 1.10.0
(function() {
  var REPO_INPUT, addRepoToLog, analyze, enterWasHit, refreshRateInfo, setupEvents, showError, showRepo, signIn, signOut, startAnalysis;

  REPO_INPUT = "#github-repo";

  $(function() {
    setupEvents();
    return refreshRateInfo();
  });

  setupEvents = function() {
    $(REPO_INPUT).keyup(function(e) {
      if (enterWasHit(e)) {
        return startAnalysis();
      }
    });
    $("#github-password").keyup(function(e) {
      if (enterWasHit(e)) {
        return signIn();
      }
    });
    $("button#analyze").click(startAnalysis);
    $("button#sign-in").click(signIn);
    $("button#sign-out").click(signOut);
    $("#github-repo").keyup(function(e) {
      return $("button#analyze").prop("disabled", e.target.value === "");
    });
    return $("#github-username").keyup(function(e) {
      return $("button#sign-in").prop("disabled", e.target.value === "");
    });
  };

  signIn = function() {
    var password, username;
    username = $("#github-username").val();
    password = $("#github-password").val();
    if (username && password) {
      App.octo = new Octokat({
        username: username,
        password: password
      });
      App.UI.signedInMode();
      return refreshRateInfo();
    }
  };

  signOut = function() {
    App.octo = new Octokat();
    App.UI.anonymousMode();
    return refreshRateInfo();
  };

  startAnalysis = function() {
    App.UI.hideResults();
    App.UI.hideResultsDisplay();
    App.UI.progress(5);
    return App.repo = new App.Repo($(REPO_INPUT).val(), showRepo, analyze, showError);
  };

  showRepo = function(repo) {
    App.UI.hideError();
    refreshRateInfo();
    App.UI.showProgressBar();
    $("#results").show();
    return $("#results h2").text(repo.name);
  };

  analyze = function(repo) {
    var icon_class;
    App.UI.hideError();
    refreshRateInfo();
    icon_class = "icon fa " + Metrics.repoEffectivenessIcon(repo);
    $("#effectiveness-icon").attr("class", icon_class);
    $("#effectiveness-desc").text(Metrics.repoEffectivenessDesc(repo));
    $(".effectiveness").text(sprintf('%.1f', repo.effectiveness()));
    $(".pr-effectiveness").text(sprintf('%.1f', repo.prEffectiveness()));
    $(".issue-effectiveness").text(sprintf('%.1f', repo.issueEffectiveness()));
    $('#open-prs').text(repo.openPullRequestCount());
    $('#closed-prs').text(repo.closedPullRequestCount());
    $('#open-issues').text(repo.openIssueCount());
    $('#closed-issues').text(repo.closedIssueCount());
    window.setTimeout(App.UI.hideProgressBar, 500);
    window.setTimeout(App.UI.showResultsDisplay, 500);
    return addRepoToLog(repo);
  };

  addRepoToLog = function(repo) {
    App.log.push(repo);
    return App.UI.refreshLog(App.log);
  };

  showError = function(message) {
    return App.UI.showError(message);
  };

  refreshRateInfo = function() {
    return App.Github.rateLimit(function(rateData) {
      return App.UI.showRateInfo(rateData);
    });
  };

  enterWasHit = function(event) {
    return event.keyCode === 13;
  };

}).call(this);