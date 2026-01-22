import '@/shared/styles/utilities.css';

export function adoptValuesOfCommonKeys(targetObj, sourceObj) {
    Object.keys(targetObj).forEach(key => (targetObj[key] = sourceObj[key]));
}

export function create2dArray(rows, columns = rows, valueFunc) {
    return new Array(rows)
        .fill()
        .map(() => new Array(columns).fill().map(() => valueFunc?.()));
}

export function getContentWidth(element) {
    return getElementWidth(element, false);
}

export function getElementWidth(element, includePadding = true) {
    const originalDisplayValue = element.style.display;
    const hasHiddenClass = element.classList.contains('hidden');

    element.style.display = 'block';
    element.classList.remove('hidden');
    let width = element.getBoundingClientRect().width;

    if (!includePadding) {
        const inlinePadding = getComputedStyle(element)
            .paddingInline.replaceAll('px', '')
            .split(' ')
            .reduce((sum, num) => (sum += +num), 0);

        width = width - inlinePadding;
    }

    if (hasHiddenClass) {
        element.classList.add('hidden');
    }

    element.style.display = originalDisplayValue;
    return width;
}

export function validateElements(elements, ElementClass = Element) {
    Object.entries(elements).forEach(([elementName, element]) => {
        if (!(element instanceof ElementClass)) {
            throw new TypeError(`Element not found: ${elementName}`);
        }
    });
}
