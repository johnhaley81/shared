'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentYearMonthBucket = exports.getYearMonthBucket = undefined;

var _joiBrowser = require('joi-browser');

var _joiBrowser2 = _interopRequireDefault(_joiBrowser);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YearMonthBucketSchema = _joiBrowser2.default.string().regex(/^\d{4}-\d{2}$/);

var validateEmailPostBody = function validateEmailPostBody(maybeYMB) {
  return Promise.resolve().then(function () {
    var _Joi$validate = _joiBrowser2.default.validate(maybeYMB, YearMonthBucketSchema),
        error = _Joi$validate.error,
        value = _Joi$validate.value;

    if (error) {
      return Promise.reject(error.annotate(true));
    }

    return value;
  });
};

var getYearMonthBucket = exports.getYearMonthBucket = function getYearMonthBucket(maybeYMB) {
  return validateEmailPostBody(maybeYMB);
};

var getCurrentYearMonthBucket = exports.getCurrentYearMonthBucket = function getCurrentYearMonthBucket() {
  return getYearMonthBucket((0, _moment2.default)().format('YYYY-MM'));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9ZZWFyTW9udGhCdWNrZXQuanMiXSwibmFtZXMiOlsiWWVhck1vbnRoQnVja2V0U2NoZW1hIiwic3RyaW5nIiwicmVnZXgiLCJ2YWxpZGF0ZUVtYWlsUG9zdEJvZHkiLCJtYXliZVlNQiIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsInZhbGlkYXRlIiwiZXJyb3IiLCJ2YWx1ZSIsInJlamVjdCIsImFubm90YXRlIiwiZ2V0WWVhck1vbnRoQnVja2V0IiwiZ2V0Q3VycmVudFllYXJNb250aEJ1Y2tldCIsImZvcm1hdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7O0FBQ0E7Ozs7OztBQUlBLElBQU1BLHdCQUF3QixxQkFBSUMsTUFBSixHQUFhQyxLQUFiLENBQW1CLGVBQW5CLENBQTlCOztBQUVBLElBQU1DLHdCQUF3QixTQUF4QkEscUJBQXdCLENBQzVCQyxRQUQ0QjtBQUFBLFNBRzVCQyxRQUFRQyxPQUFSLEdBQWtCQyxJQUFsQixDQUF1QixZQUE2QztBQUFBLHdCQUN6QyxxQkFBSUMsUUFBSixDQUFhSixRQUFiLEVBQXVCSixxQkFBdkIsQ0FEeUM7QUFBQSxRQUMxRFMsS0FEMEQsaUJBQzFEQSxLQUQwRDtBQUFBLFFBQ25EQyxLQURtRCxpQkFDbkRBLEtBRG1EOztBQUdsRSxRQUFJRCxLQUFKLEVBQVc7QUFDVCxhQUFPSixRQUFRTSxNQUFSLENBQWVGLE1BQU1HLFFBQU4sQ0FBZSxJQUFmLENBQWYsQ0FBUDtBQUNEOztBQUVELFdBQU9GLEtBQVA7QUFDRCxHQVJELENBSDRCO0FBQUEsQ0FBOUI7O0FBYU8sSUFBTUcsa0RBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ1QsUUFBRDtBQUFBLFNBQ2hDRCxzQkFBc0JDLFFBQXRCLENBRGdDO0FBQUEsQ0FBM0I7O0FBR0EsSUFBTVUsZ0VBQTRCLFNBQTVCQSx5QkFBNEI7QUFBQSxTQUN2Q0QsbUJBQW1CLHdCQUFTRSxNQUFULENBQWdCLFNBQWhCLENBQW5CLENBRHVDO0FBQUEsQ0FBbEMiLCJmaWxlIjoiWWVhck1vbnRoQnVja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGZsb3dcblxuaW1wb3J0IEpvaSBmcm9tICdqb2ktYnJvd3Nlcic7XG5pbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5cbmV4cG9ydCBvcGFxdWUgdHlwZSBZZWFyTW9udGhCdWNrZXRUeXBlOiBzdHJpbmcgPSBzdHJpbmc7XG5cbmNvbnN0IFllYXJNb250aEJ1Y2tldFNjaGVtYSA9IEpvaS5zdHJpbmcoKS5yZWdleCgvXlxcZHs0fS1cXGR7Mn0kLyk7XG5cbmNvbnN0IHZhbGlkYXRlRW1haWxQb3N0Qm9keSA9IChcbiAgbWF5YmVZTUI6IHN0cmluZ1xuKTogUHJvbWlzZTxZZWFyTW9udGhCdWNrZXRUeXBlPiA9PlxuICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpOiBQcm9taXNlPHN0cmluZz4gfCBZZWFyTW9udGhCdWNrZXRUeXBlID0+IHtcbiAgICBjb25zdCB7IGVycm9yLCB2YWx1ZSB9ID0gSm9pLnZhbGlkYXRlKG1heWJlWU1CLCBZZWFyTW9udGhCdWNrZXRTY2hlbWEpO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoZXJyb3IuYW5ub3RhdGUodHJ1ZSkpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfSk7XG5cbmV4cG9ydCBjb25zdCBnZXRZZWFyTW9udGhCdWNrZXQgPSAobWF5YmVZTUI6IHN0cmluZykgPT5cbiAgdmFsaWRhdGVFbWFpbFBvc3RCb2R5KG1heWJlWU1CKTtcblxuZXhwb3J0IGNvbnN0IGdldEN1cnJlbnRZZWFyTW9udGhCdWNrZXQgPSAoKSA9PlxuICBnZXRZZWFyTW9udGhCdWNrZXQobW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NJykpO1xuIl19