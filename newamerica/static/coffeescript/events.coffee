url_array = document.URL.split("/")

if document.URL.split("/")[4] is "events"
    $("#tag-content").hide() #hide results till events are ready
    $("#events-content").removeClass "dn"

EventModel = Backbone.Model.extend(
  initialize: (options) ->
    @options = options
    _.bindAll this, "checkLocationVisibility"
    @set "isMultidayEvent", (moment(@get("startTime"), @dateFormat).dayOfYear() isnt moment(@get("endTime"), @dateFormat).dayOfYear())
    @addStartEndTimes()
    @subscribeToEvents()
    return

  locationVisibility: true
  dateFormat: "YYYY-MM-DDTHH:mm:ss Z"
  addStartEndTimes: ->
    if @get("isMultidayEvent")
      @set "startDate", moment(@get("startTime"), @dateFormat).format("MMM D, YYYY h:mmA")
      @set "endDate", moment(@get("endTime"), @dateFormat).format("MMM D, YYYY h:mmA")
    else
      @set "startDate", moment(@get("startTime"), @dateFormat).format("MMM D, YYYY")
      @set "startTime", moment(@get("startTime"), @dateFormat).format("h:mmA")
      @set "endTime", moment(@get("endTime"), @dateFormat).format("h:mmA")
    return

  subscribeToEvents: ->
    @listenTo EventDispatcher, "location:select", @checkLocationVisibility
    @listenTo EventDispatcher, "events:switch", @makeAllVisible
    return

  makeAllVisible: ->
    @set "locationVisible", true
    return

  checkLocationVisibility: (location) ->
    location = location or "All"
    @set "locationVisible", (location is @get("location")) or (location is "All")
    return
)
EventCollection = Backbone.Collection.extend(model: EventModel)
EventView = Backbone.View.extend(
  tagName: "li"
  className: "event"
  eventTemplate: _.template("<p class=\"event-meta\"><span>EVENT</span> | <% if (isMultidayEvent) {  %><span class=\"event-start\"><%= startDate %></span> - <span class=\"event-end\"><%= endDate %></span> | <% } else { %><span class=\"event-date\"><%= startDate %></span> | <span class=\"event-time\"><%= startTime %> - <%= endTime %></span> | <% } %> <%= location %> <i></i> <i></i></p><p class=\"event-title\"><a href=\"/events/<%= slug %>\"><%= title %></a></p><p class=\"event-description\"><%= description %></p>")
  initialize: (options) ->
    _.bindAll this, "toggleLocationVisibility"
    @subscribeToEvents()
    return

  render: ->
    @$el.html @eventTemplate(@model.attributes)

  subscribeToEvents: ->
    @listenTo @model, "change:locationVisible", @toggleLocationVisibility
    return

  toggleLocationVisibility: (model, locationVisible) ->
    if locationVisible
      @$el.removeClass "hide"
    else
      @$el.addClass "hide"
    return

  togglePageVisibility: (visiblePage) ->
    if parseInt(visiblePage, 10) is parseInt(@model.get("page"), 10)
      @$el.removeClass "hide"
      @model.set "locationVisible", false
    else
      @$el.addClass "hide"
    return
)
EventCollectionView = Backbone.View.extend(
  eventUrl: ->
    "http://localhost:8080/events" + ((if (@options.type is "upcoming") then "" else "/past"))

  initialize: (options) ->
    @options = options
    _.bindAll this, "addEventView", "displayEvents"
    @eventViewList = []
    @eventList = new EventCollection()
    @eventList.type = @options.type
    @registerForEvents()
    @loadEvents()
    return

  registerForEvents: ->
    @listenTo @eventList, "add", @addEventView
    return

  addEventView: (newModel) ->
    newView = new EventView(model: newModel)
    @eventViewList.push newView
    return

  getUpcomingEvents: (options) ->
    $.ajax
      url: @eventUrl()
      type: "GET"
      data: options


  displayEvents: (eventCollection) ->
    _(eventCollection.events).each (event) ->
      event.page = eventCollection.page
      event.shortname = event.location.replace(" ", "").toLowerCase()
      return

    @eventList.add eventCollection.events
    EventDispatcher.trigger "events:route"
    return

  loadEvents: ->
    @getUpcomingEvents().done @displayEvents
    return

  render: ->
    that = this
    page = (if pathCache.page then parseInt(pathCache.page, 10) else 1)
    @currentViewCollection = @currentViewCollection.slice((page - 1) * PER_PAGE, (page) * PER_PAGE)  if @currentViewCollection.length
    @$el.empty()
    _(@currentViewCollection).each (modelView) ->
      that.$el.append modelView.render()
      return

    @$el

  renderCurrentCollection: ->
    fullListLength = undefined
    if pathCache.location
      @currentViewCollection = @eventViewList.filter((eventView) ->
        eventView.model.get("shortname") is pathCache.location
      , this)
    else
      @currentViewCollection = @eventViewList
    fullListLength = @currentViewCollection.length
    @render()
    fullListLength
)
EventTypeView = Backbone.View.extend(
  initialize: (options) ->
    @type = options.type
    @activeCollection = not @$el.hasClass("hide")
    @createSubViews()
    EventDispatcher.on "events:switch", @switchEventVisibility, this
    return

  createSubViews: ->
    @eventsListView = new EventCollectionView(
      el: @$(".events-list")[0]
      type: @type
    )
    @paginationView = new PaginationView(el: @$(".pagination"))
    return

  switchEventVisibility: (type) ->
    @activeCollection = (@type is type)
    if @activeCollection
      @$el.removeClass "hide"
    else
      @$el.addClass "hide"
    return

  routePath: ->
    currentCollectionCount = @eventsListView.renderCurrentCollection()
    @paginationView.handlePagination currentCollectionCount
    return
)
PaginationView = Backbone.View.extend(
  events:
    "click li": "changePage"

  handlePagination: (eventCount) ->
    @numPages = Math.ceil(eventCount / PER_PAGE)
    @render()
    return

  render: ->
    page = (if pathCache.page then pathCache.page else 1)
    i = undefined
    @$el.empty()
    if @numPages
      i = 0
      while i < @numPages
        @$el.append "<li data-page=\"" + (i + 1) + "\">" + (i + 1) + "</li>"
        i++
      @$("li:nth-child(" + page + ")").addClass "active"
    @$el

  changePage: (event) ->
    newPath = ""
    $el = $(event.target)
    unless $el.hasClass("active")
      @$("li").removeClass "active"
      $el.addClass "active"
      newPath = "location/" + pathCache.location  if pathCache.location
      newPath = newPath + "/past"  if pathCache.type is "past"
      newPath = newPath + "/" + $el.data("page")
      EventsRouter.navigate newPath,
        trigger: true

    return
)
LocationsView = Backbone.View.extend(
  initialize: (options) ->
    initialLocation = pathCache.location or "all"
    @$locations = @$("li")
    @$("[data-location=\"" + initialLocation + "\"]").addClass "active"
    return

  events:
    "click li": "selectLocation"

  selectLocation: (event) ->
    $el = $(event.target)
    newPath = ""
    location = undefined
    url = undefined
    unless $el.hasClass("active")
      location = $el.data("location")
      @$locations.removeClass "active"
      $el.addClass "active"
      newPath = "location/" + location  if location isnt "all"
      newPath = newPath + "/past"  if pathCache.type is "past"
      EventsRouter.navigate newPath,
        trigger: true

    return
)
EventTypeSwitchView = Backbone.View.extend(
  initialize: ->
    currentPageType = (if pathCache.type then pathCache.type else "upcoming")
    @$eventTypes = @$("span")
    @$("[data-event=\"" + currentPageType + "\"]").addClass "active"
    return

  events:
    "click span": "handleEventTypeClick"

  handleEventTypeClick: (event) ->
    $element = $(event.target)
    newPath = ""
    type = undefined
    unless $element.hasClass("active")
      type = $element.data("event")
      @$eventTypes.removeClass "active"
      $element.addClass "active"
      newPath = "location/" + pathCache.location  if pathCache.location
      newPath = newPath + "/past"  if type is "past"
      EventsRouter.navigate newPath,
        trigger: true

    return
)
EventPageView = Backbone.View.extend(
  initialize: (options) ->
    @createOtherViews()
    @listenTo EventDispatcher, "events:route", @routePath
    @routePath()
    return

  createOtherViews: ->
    @eventTypeSwitch = new EventTypeSwitchView(el: @$(".event-switch"))
    @pastEvents = new EventTypeView(
      type: "past"
      el: "#past-events"
    )
    @upcomingEvents = new EventTypeView(
      type: "upcoming"
      el: "#upcoming-events"
    )
    @locationsView = new LocationsView(el: "#locations")
    return

  routePath: ->
    currentPageType = (if pathCache.type then @pastEvents else @upcomingEvents)
    EventDispatcher.trigger "events:switch", currentPageType.type
    currentPageType.routePath()
    return
)
Router = Backbone.Router.extend(
  routes:
    "location/:location/past/:pageNum": "locationPastPage"
    "location/:location/past": "locationPast"
    "location/:location/:pageNum": "locationPage"
    "location/:location": "location"
    "past/:pageNum": "pastEventsPage"
    past: "pastEvents"
    ":pageNum": "baseRoutePage"
    "": "baseRoute"

  location: (location) ->
    pathCache = location: location
    EventDispatcher.trigger "events:route", pathCache
    return

  locationPage: (location, pageNum) ->
    pathCache =
      location: location
      page: pageNum

    EventDispatcher.trigger "events:route", pathCache
    return

  locationPast: (location) ->
    pathCache =
      location: location
      type: "past"

    EventDispatcher.trigger "events:route", pathCache
    return

  locationPastPage: (location, pageNum) ->
    pathCache =
      location: location
      page: pageNum
      type: "past"

    EventDispatcher.trigger "events:route", pathCache
    return

  baseRoute: ->
    pathCache = {}
    EventDispatcher.trigger "events:route", pathCache
    return

  baseRoutePage: (pageNum) ->
    pathCache = page: pageNum
    EventDispatcher.trigger "events:route", pathCache
    return

  pastEvents: ->
    pathCache = type: "past"
    EventDispatcher.trigger "events:route", pathCache
    return

  pastEventsPage: (pageNum) ->
    pathCache =
      page: pageNum
      type: "past"

    EventDispatcher.trigger "events:route", pathCache
    return
)
EventDispatcher = undefined
EventsRouter = undefined
eventPage = undefined
pathCache = undefined
PER_PAGE = 15
$ ->
  EventDispatcher = _.extend({}, Backbone.Events)
  EventsRouter = new Router()
  Backbone.history.start
    pushState: true
    root: "/"

  eventPage = new EventPageView(el: "#events-content")
  return
