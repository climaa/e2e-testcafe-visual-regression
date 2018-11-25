const { variables, screenshot } = require('./setup/common-tests');
const { Selector }  = require('testcafe');

fixture `Demo visual regression - simple calculator`
    .disablePageReloads
    .page(page)
    .beforeEach(async t => {
        await variables(t);
        t.ctx.one = Selector('button').withText('1');
        t.ctx.two = Selector('button').withText('2');
        t.ctx.three = Selector('button').withText('3');
        t.ctx.four = Selector('button').withText('4');
        t.ctx.five = Selector('button').withText('5');
        t.ctx.six = Selector('button').withText('6');
        t.ctx.seven = Selector('button').withText('7');
        t.ctx.eight = Selector('button').withText('8');
        t.ctx.zero = Selector('button').withText('0');
        t.ctx.display = Selector('#display');
        t.ctx.plus = Selector('input[value="+"]');
        t.ctx.minus = Selector('input[value="-"]');
        t.ctx.multiply = Selector('input[value="*"]');
        t.ctx.division = Selector('input[value="/"]');
        t.ctx.equal = Selector('input[value="="]');
        t.ctx.clear = Selector('input[value="C"]');
    });

test('should sum 3 + 7 and expect a 10 number on input.', async t => {
    const { three, seven, display, plus, equal } = t.ctx;
    
    await t.resizeWindow(viewport, 768);
    await t.hover(three).click(three);
    await t.hover(plus).click(plus);
    await t.hover(seven).click(seven);
    await t.hover(equal).click(equal);
    await screenshot(t, 'a_sum');
    await t.expect(display.value).eql('10');
});

test('should subtraction 1000 - 500 and expect a 500 number on input.', async t => {
    const { one, zero, five, display, minus, equal } = t.ctx;
    
    await t.resizeWindow(viewport, 768);
    await t.hover(one).click(one);
    await t.hover(zero).click(zero).click(zero).click(zero);
    await t.hover(minus).click(minus);
    await t.hover(five).click(five);
    await t.hover(zero).click(zero).click(zero);
    await t.hover(equal).click(equal);
    await screenshot(t, 'b_subtraction');
    await t.expect(display.value).eql('500');
});

test('should multiplication 1024 x 768 expect a 786,432 number on input.', async t => {
    const { zero, one, two, four, seven, six, eight, multiply, equal, display } = t.ctx;

    await t.hover(one).click(one);
    await t.hover(zero).click(zero);
    await t.hover(two).click(two);
    await t.hover(four).click(four);
    await t.hover(multiply).click(multiply);
    await t.hover(seven).click(seven);
    await t.hover(six).click(six);
    await t.hover(eight).click(eight);
    await t.hover(equal).click(equal);
    await screenshot(t, 'c_multiply');
    await t.expect(display.value).eql('786432');
});

test('should divide 100 / 25 expect a 5 number on input.', async t => {
    const { zero, one, two, five, division, equal, display } = t.ctx;

    await t.hover(one).click(one);
    await t.hover(zero).click(zero).click(zero);
    await t.hover(division).click(division);
    await t.hover(two).click(two);
    await t.hover(five).click(five);
    await t.hover(equal).click(equal);
    await screenshot(t, 'd_division');
    await t.expect(display.value).eql('4');
});

test('should press numbers and then press the button C appears on zero on input.', async t => {
    const { one, two, three, clear, display } = t.ctx;

    await t.hover(one).click(one);
    await t.hover(two).click(two);
    await t.hover(three).click(three);
    await t.hover(clear).click(clear);
    await screenshot(t, 'e_clear');
    await t.expect(display.value).eql('0');
});
