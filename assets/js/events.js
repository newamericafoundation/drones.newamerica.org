(function() {
  var EventCollection, EventCollectionView, EventDispatcher, EventModel, EventPageView, EventTypeSwitchView, EventTypeView, EventView, EventsRouter, LocationsView, PER_PAGE, PaginationView, Router, eventPage, pathCache, url_array;

  url_array = document.URL.split("/");

  if (document.URL.split("/")[4] === "events") {
    $("#tag-content").hide();
    $("#events-content").removeClass("dn");
  }

  EventModel = Backbone.Model.extend({
    initialize: function(options) {
      this.options = options;
      _.bindAll(this, "checkLocationVisibility");
      this.set("isMultidayEvent", moment(this.get("startTime"), this.dateFormat).dayOfYear() !== moment(this.get("endTime"), this.dateFormat).dayOfYear());
      this.addStartEndTimes();
      this.subscribeToEvents();
    },
    locationVisibility: true,
    dateFormat: "YYYY-MM-DDTHH:mm:ss Z",
    addStartEndTimes: function() {
      if (this.get("isMultidayEvent")) {
        this.set("startDate", moment(this.get("startTime"), this.dateFormat).format("MMM D, YYYY h:mmA"));
        this.set("endDate", moment(this.get("endTime"), this.dateFormat).format("MMM D, YYYY h:mmA"));
      } else {
        this.set("startDate", moment(this.get("startTime"), this.dateFormat).format("MMM D, YYYY"));
        this.set("startTime", moment(this.get("startTime"), this.dateFormat).format("h:mmA"));
        this.set("endTime", moment(this.get("endTime"), this.dateFormat).format("h:mmA"));
      }
    },
    subscribeToEvents: function() {
      this.listenTo(EventDispatcher, "location:select", this.checkLocationVisibility);
      this.listenTo(EventDispatcher, "events:switch", this.makeAllVisible);
    },
    makeAllVisible: function() {
      this.set("locationVisible", true);
    },
    checkLocationVisibility: function(location) {
      location = location || "All";
      this.set("locationVisible", (location === this.get("location")) || (location === "All"));
    }
  });

  EventCollection = Backbone.Collection.extend({
    model: EventModel
  });

  EventView = Backbone.View.extend({
    tagName: "li",
    className: "event",
    eventTemplate: _.template("<p class=\"event-meta\"><span>EVENT</span> | <% if (isMultidayEvent) {  %><span class=\"event-start\"><%= startDate %></span> - <span class=\"event-end\"><%= endDate %></span> | <% } else { %><span class=\"event-date\"><%= startDate %></span> | <span class=\"event-time\"><%= startTime %> - <%= endTime %></span> | <% } %> <%= location %> <i></i> <i></i></p><p class=\"event-title\"><a href=\"/events/<%= slug %>\"><%= title %></a></p><p class=\"event-description\"><%= description %></p>"),
    initialize: function(options) {
      _.bindAll(this, "toggleLocationVisibility");
      this.subscribeToEvents();
    },
    render: function() {
      return this.$el.html(this.eventTemplate(this.model.attributes));
    },
    subscribeToEvents: function() {
      this.listenTo(this.model, "change:locationVisible", this.toggleLocationVisibility);
    },
    toggleLocationVisibility: function(model, locationVisible) {
      if (locationVisible) {
        this.$el.removeClass("hide");
      } else {
        this.$el.addClass("hide");
      }
    },
    togglePageVisibility: function(visiblePage) {
      if (parseInt(visiblePage, 10) === parseInt(this.model.get("page"), 10)) {
        this.$el.removeClass("hide");
        this.model.set("locationVisible", false);
      } else {
        this.$el.addClass("hide");
      }
    }
  });

  EventCollectionView = Backbone.View.extend({
    eventUrl: function() {
      return "http://localhost:8080/events" + (this.options.type === "upcoming" ? "" : "/past");
    },
    initialize: function(options) {
      this.options = options;
      _.bindAll(this, "addEventView", "displayEvents");
      this.eventViewList = [];
      this.eventList = new EventCollection();
      this.eventList.type = this.options.type;
      this.registerForEvents();
      this.loadEvents();
    },
    registerForEvents: function() {
      this.listenTo(this.eventList, "add", this.addEventView);
    },
    addEventView: function(newModel) {
      var newView;
      newView = new EventView({
        model: newModel
      });
      this.eventViewList.push(newView);
    },
    getUpcomingEvents: function(options) {
      return $.ajax({
        url: this.eventUrl(),
        type: "GET",
        data: options
      });
    },
    displayEvents: function(eventCollection) {
      _(eventCollection.events).each(function(event) {
        event.page = eventCollection.page;
        event.shortname = event.location.replace(" ", "").toLowerCase();
      });
      this.eventList.add(eventCollection.events);
      EventDispatcher.trigger("events:route");
    },
    loadEvents: function() {
      this.getUpcomingEvents().done(this.displayEvents);
    },
    render: function() {
      var page, that;
      that = this;
      page = (pathCache.page ? parseInt(pathCache.page, 10) : 1);
      if (this.currentViewCollection.length) {
        this.currentViewCollection = this.currentViewCollection.slice((page - 1) * PER_PAGE, page * PER_PAGE);
      }
      this.$el.empty();
      _(this.currentViewCollection).each(function(modelView) {
        that.$el.append(modelView.render());
      });
      return this.$el;
    },
    renderCurrentCollection: function() {
      var fullListLength;
      fullListLength = void 0;
      if (pathCache.location) {
        this.currentViewCollection = this.eventViewList.filter(function(eventView) {
          return eventView.model.get("shortname") === pathCache.location;
        }, this);
      } else {
        this.currentViewCollection = this.eventViewList;
      }
      fullListLength = this.currentViewCollection.length;
      this.render();
      return fullListLength;
    }
  });

  EventTypeView = Backbone.View.extend({
    initialize: function(options) {
      this.type = options.type;
      this.activeCollection = !this.$el.hasClass("hide");
      this.createSubViews();
      EventDispatcher.on("events:switch", this.switchEventVisibility, this);
    },
    createSubViews: function() {
      this.eventsListView = new EventCollectionView({
        el: this.$(".events-list")[0],
        type: this.type
      });
      this.paginationView = new PaginationView({
        el: this.$(".pagination")
      });
    },
    switchEventVisibility: function(type) {
      this.activeCollection = this.type === type;
      if (this.activeCollection) {
        this.$el.removeClass("hide");
      } else {
        this.$el.addClass("hide");
      }
    },
    routePath: function() {
      var currentCollectionCount;
      currentCollectionCount = this.eventsListView.renderCurrentCollection();
      this.paginationView.handlePagination(currentCollectionCount);
    }
  });

  PaginationView = Backbone.View.extend({
    events: {
      "click li": "changePage"
    },
    handlePagination: function(eventCount) {
      this.numPages = Math.ceil(eventCount / PER_PAGE);
      this.render();
    },
    render: function() {
      var i, page;
      page = (pathCache.page ? pathCache.page : 1);
      i = void 0;
      this.$el.empty();
      if (this.numPages) {
        i = 0;
        while (i < this.numPages) {
          this.$el.append("<li data-page=\"" + (i + 1) + "\">" + (i + 1) + "</li>");
          i++;
        }
        this.$("li:nth-child(" + page + ")").addClass("active");
      }
      return this.$el;
    },
    changePage: function(event) {
      var $el, newPath;
      newPath = "";
      $el = $(event.target);
      if (!$el.hasClass("active")) {
        this.$("li").removeClass("active");
        $el.addClass("active");
        if (pathCache.location) {
          newPath = "location/" + pathCache.location;
        }
        if (pathCache.type === "past") {
          newPath = newPath + "/past";
        }
        newPath = newPath + "/" + $el.data("page");
        EventsRouter.navigate(newPath, {
          trigger: true
        });
      }
    }
  });

  LocationsView = Backbone.View.extend({
    initialize: function(options) {
      var initialLocation;
      initialLocation = pathCache.location || "all";
      this.$locations = this.$("li");
      this.$("[data-location=\"" + initialLocation + "\"]").addClass("active");
    },
    events: {
      "click li": "selectLocation"
    },
    selectLocation: function(event) {
      var $el, location, newPath, url;
      $el = $(event.target);
      newPath = "";
      location = void 0;
      url = void 0;
      if (!$el.hasClass("active")) {
        location = $el.data("location");
        this.$locations.removeClass("active");
        $el.addClass("active");
        if (location !== "all") {
          newPath = "location/" + location;
        }
        if (pathCache.type === "past") {
          newPath = newPath + "/past";
        }
        EventsRouter.navigate(newPath, {
          trigger: true
        });
      }
    }
  });

  EventTypeSwitchView = Backbone.View.extend({
    initialize: function() {
      var currentPageType;
      currentPageType = (pathCache.type ? pathCache.type : "upcoming");
      this.$eventTypes = this.$("span");
      this.$("[data-event=\"" + currentPageType + "\"]").addClass("active");
    },
    events: {
      "click span": "handleEventTypeClick"
    },
    handleEventTypeClick: function(event) {
      var $element, newPath, type;
      $element = $(event.target);
      newPath = "";
      type = void 0;
      if (!$element.hasClass("active")) {
        type = $element.data("event");
        this.$eventTypes.removeClass("active");
        $element.addClass("active");
        if (pathCache.location) {
          newPath = "location/" + pathCache.location;
        }
        if (type === "past") {
          newPath = newPath + "/past";
        }
        EventsRouter.navigate(newPath, {
          trigger: true
        });
      }
    }
  });

  EventPageView = Backbone.View.extend({
    initialize: function(options) {
      this.createOtherViews();
      this.listenTo(EventDispatcher, "events:route", this.routePath);
      this.routePath();
    },
    createOtherViews: function() {
      this.eventTypeSwitch = new EventTypeSwitchView({
        el: this.$(".event-switch")
      });
      this.pastEvents = new EventTypeView({
        type: "past",
        el: "#past-events"
      });
      this.upcomingEvents = new EventTypeView({
        type: "upcoming",
        el: "#upcoming-events"
      });
      this.locationsView = new LocationsView({
        el: "#locations"
      });
    },
    routePath: function() {
      var currentPageType;
      currentPageType = (pathCache.type ? this.pastEvents : this.upcomingEvents);
      EventDispatcher.trigger("events:switch", currentPageType.type);
      currentPageType.routePath();
    }
  });

  Router = Backbone.Router.extend({
    routes: {
      "location/:location/past/:pageNum": "locationPastPage",
      "location/:location/past": "locationPast",
      "location/:location/:pageNum": "locationPage",
      "location/:location": "location",
      "past/:pageNum": "pastEventsPage",
      past: "pastEvents",
      ":pageNum": "baseRoutePage",
      "": "baseRoute"
    },
    location: function(location) {
      var pathCache;
      pathCache = {
        location: location
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    locationPage: function(location, pageNum) {
      var pathCache;
      pathCache = {
        location: location,
        page: pageNum
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    locationPast: function(location) {
      var pathCache;
      pathCache = {
        location: location,
        type: "past"
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    locationPastPage: function(location, pageNum) {
      var pathCache;
      pathCache = {
        location: location,
        page: pageNum,
        type: "past"
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    baseRoute: function() {
      var pathCache;
      pathCache = {};
      EventDispatcher.trigger("events:route", pathCache);
    },
    baseRoutePage: function(pageNum) {
      var pathCache;
      pathCache = {
        page: pageNum
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    pastEvents: function() {
      var pathCache;
      pathCache = {
        type: "past"
      };
      EventDispatcher.trigger("events:route", pathCache);
    },
    pastEventsPage: function(pageNum) {
      var pathCache;
      pathCache = {
        page: pageNum,
        type: "past"
      };
      EventDispatcher.trigger("events:route", pathCache);
    }
  });

  EventDispatcher = void 0;

  EventsRouter = void 0;

  eventPage = void 0;

  pathCache = void 0;

  PER_PAGE = 15;

  $(function() {
    EventDispatcher = _.extend({}, Backbone.Events);
    EventsRouter = new Router();
    Backbone.history.start({
      pushState: true,
      root: "/"
    });
    eventPage = new EventPageView({
      el: "#events-content"
    });
  });

}).call(this);
