// #generates properly-formatted dates from free-text date forms
// #by spencer kelly 2014

var date_extractor = (function() {
  var months = "(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|aug|sept|oct|nov|dec),?";
  var days = "([0-9]{1,2}),?";
  var years = "([12][0-9]{3})";

  var to_obj = function(arr, places) {
    return Object.keys(places).reduce(function(h, k) {
      h[k] = arr[places[k]];
      return h;
    }, {});
  };

  var regexes = [
    {
      reg: "" + months + " " + days + "-" + days + " " + years,
      example: "March 7th-11th 1987",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          day: 2,
          to_day: 3,
          year: 4
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + days + " of " + months + " to " + days + " of " + months + ",? " + years,
      example: "28th of September to 5th of October 2008",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          day: 1,
          month: 2,
          to_day: 3,
          to_month: 4,
          to_year: 5
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + months + " " + days + " to " + months + " " + days + " " + years,
      example: "March 7th to june 11th 1987",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          day: 2,
          to_month: 3,
          to_day: 4,
          year: 5,
          to_year: 5
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "between " + days + " " + months + " and " + days + " " + months + " " + years,
      example: "between 13 February and 15 February 1945",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          day: 1,
          month: 2,
          to_day: 3,
          to_month: 4,
          year: 5,
          to_year: 5
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "between " + months + " " + days + " and " + months + " " + days + " " + years,
      example: "between March 7th and june 11th 1987",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          day: 2,
          to_month: 3,
          to_day: 4,
          year: 5,
          to_year: 5
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + months + " " + days + " " + years,
      example: "March 1st 1987",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          day: 2,
          year: 3
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + days + " - " + days + " of " + months + ",? " + years,
      example: "3rd - 5th of March 1969",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          day: 1,
          to_day: 2,
          month: 3,
          year: 4
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + days + " of " + months + ",? " + years,
      example: "3rd of March 1969",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          day: 1,
          month: 2,
          year: 3
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + months + " " + years + ",? to " + months + " " + years,
      example: "September 1939 to April 1945",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          year: 2,
          to_month: 3,
          to_year: 4
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + months + " " + years,
      example: "March 1969",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          year: 2
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + months + " " + days,
      example: "March 18th",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 1,
          day: 2
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + days + " of " + months,
      example: "18th of March",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          month: 2,
          day: 1
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + years + " ?- ?" + years,
      example: "1997-1998",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          year: 1,
          to_year: 2
        };
        return to_obj(arr, places);
      }
    }, {
      reg: "" + years,
      example: "1998",
      process: function(arr) {
        var places;
        if (!arr) {
          arr = [];
        }
        places = {
          year: 1
        };
        return to_obj(arr, places);
      }
    }
  ].map(function(o) {
    o.reg = new RegExp(o.reg, "g");
    return o;
  });

  //0 based months, 1 based days...
  var months_obj = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    aug: 7,
    sept: 8,
    oct: 9,
    nov: 10,
    dec: 11
  };

  //thirty days hath september...
  var last_dates = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var preprocess = function(str) {
    str = str.toLowerCase();
    str = str.replace(/([0-9])(th|rd|st)/g, '$1');
    return str;
  };

  var postprocess = function(obj, options) {
    var d;
    d = new Date();
    options = options || {};
    obj.year = parseInt(obj.year,10) || undefined;
    obj.day = parseInt(obj.day,10) || undefined;
    obj.to_day = parseInt(obj.to_day,10) || undefined;
    obj.to_year = parseInt(obj.to_year,10) || undefined;
    obj.month = months_obj[obj.month];
    obj.to_month = months_obj[obj.to_month];
    //swap to_month and month
    if (obj.to_month !== undefined && obj.month === undefined) {
      obj.month = obj.to_month;
    }
    if (obj.to_month === undefined && obj.month !== undefined) {
      obj.to_month = obj.month;
    }
    //swap to_year and year
    if (obj.to_year && !obj.year) {
      obj.year = obj.to_year;
    }
    if (!obj.to_year && obj.year && obj.to_month!==undefined) {
      obj.to_year = obj.year;
    }
    if (options.assume_year && !obj.year) {
      obj.year = d.getFullYear();
    }
    //make sure date is in that month..
    if (obj.day !== undefined && (obj.day > 31 || (obj.month !== undefined && obj.day > last_dates[obj.month]))) {
      obj.day = undefined;
    }
    //make sure to date is after from date. fail everything if so...
    //todo: do this smarter
    if (obj.to_month !== undefined && obj.to_month < obj.month) {
      return {}
    }
    if (obj.to_year && obj.to_year < obj.year) {
      obj.year = undefined;
      obj.to_year = undefined;
    }

    //make sure date is in reasonable range (very opinionated)
    if (obj.year > 2090 || obj.year < 1200) {
      obj.year = undefined;
      obj.to_year = undefined;
    }
    //format result better
    obj = {
      day: obj.day,
      month: obj.month,
      year: obj.year,
      to: {
        day: obj.to_day,
        month: obj.to_month,
        year: obj.to_year
      }
    };
    //add javascript date objects, if you can
    if (obj.year && obj.day && obj.month !== undefined) {
      obj.date_object = new Date();
      obj.date_object.setYear(obj.year);
      obj.date_object.setMonth(obj.month);
      obj.date_object.setDate(obj.day);
    }
    if (obj.to.year && obj.to.day && obj.to.month !== undefined) {
      obj.to.date_object = new Date();
      obj.to.date_object.setYear(obj.to.year);
      obj.to.date_object.setMonth(obj.to.month);
      obj.to.date_object.setDate(obj.to.day);
    }
    //if we have enough data to return a result..
    if (obj.year || obj.month !== undefined) {
      return obj;
    }
    return {};
  };

  //pass through sequence of regexes until tempate is matched..
  var main = function(str, options) {
    var arr, good, obj, _i, _len;
    options = options || {};
    str = preprocess(str);
    for (_i = 0, _len = regexes.length; _i < _len; _i++) {
      obj = regexes[_i];
      if (str.match(obj.reg)) {
        arr = obj.reg.exec(str);
        good = obj.process(arr);
        good = postprocess(good, options);
        return good;
      }
    }
    return {};
  };

  //export modules
  if (typeof module !== "undefined" && module.exports) {
    module.exports = main;
  }
  return main;

})();

// console.log(date_extractor("january 6th 1998"))
