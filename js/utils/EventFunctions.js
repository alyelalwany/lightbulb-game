export function delegate(parent, eventType, selector, functionHandler) {
  parent.addEventListener(eventType, function (event) {
    const targetElement = event.target;
    // console.log(targetElement);
    if (targetElement.matches(selector)) {
      functionHandler.call(targetElement, event);
    }
  });
}
