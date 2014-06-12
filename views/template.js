(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['activation'] = template({"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  return "<form class=\"form-signin\" role=\"form\">\n  <h1 class=\"form-signin-heading\">Screen activation</h1>\n  <input type=\"text\" class=\"form-control form-activation-code\" placeholder=\"Activation code\" required autofocus>\n  <button class=\"btn btn-primary btn-block btn-activate\" type=\"submit\">Activate</button>\n</form>";
  },"useData":true});
templates['slide'] = template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", escapeExpression=this.escapeExpression;
  return "\n    <li>\n      "
    + escapeExpression(((helper = helpers.image || (depth0 && depth0.image)),(typeof helper === functionType ? helper.call(depth0, {"name":"image","hash":{},"data":data}) : helper)))
    + "\n    </li>\n    ";
},"compiler":[5,">= 2.0.0"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div>\n  <ul>\n    ";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.slides), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  return buffer + "\n  <ul>\n<div>";
},"useData":true});
})();