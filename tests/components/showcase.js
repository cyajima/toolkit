define([
    'jquery',
    '../../js/components/showcase'
], function($) {

describe('Toolkit.Showcase', function() {
    var element,
        showcase;

    before(function() {
        element = $('<div/>').html(
            '<a href="http://placehold.it/500x500/4c6278/ffffff" class="js-showcase" title="Foobar"><img src="http://placehold.it/200x150/4c6278/ffffff" alt=""></a>' +
            '<a href="http://placehold.it/400x300/42586e/ffffff" class="js-showcase"><img src="http://placehold.it/200x150/42586e/ffffff" alt=""></a>' +
            '<a href="http://placehold.it/1600x900/344a5f/ffffff" class="js-showcase"><img src="http://placehold.it/200x150/344a5f/ffffff" alt=""></a>' +
            '<a href="http://placehold.it/1500x500/293f54/ffffff" class="js-showcase"><img src="http://placehold.it/200x150/293f54/ffffff" alt=""></a>' +
            '<a href="http://broken.url" class="js-showcase"><img src="http://broken.url" alt=""></a>'
        ).appendTo('body');

        showcase = $('.js-showcase').showcase().toolkit('showcase');
    });

    after(function() {
        element.remove();
        showcase.blackout.element.remove();
    });

    describe('constructor()', function() {
        it('should create the template element', function() {
            expect($('body > .showcase').length).to.equal(1);
        });

        it('should find the items element in the template', function() {
            expect(showcase.items.length).to.equal(1);
        });

        it('should find the tabs element in the template', function() {
            expect(showcase.tabs.length).to.equal(1);
        });

        it('should find the caption element in the template', function() {
            expect(showcase.caption.length).to.equal(1);
        });
    });

    describe('hide()', function() {
        beforeEach(function() {
            showcase.show(element.find('a:first'));
        });

        it('should hide the element', function(done) {
            setTimeout(function() {
                expect(showcase.element.hasClass('show')).to.be.true;

                showcase.hide();

                expect(showcase.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });
    });

    describe('jump()', function() {
        before(function() {
            element.find('a').attr('data-showcase', 'group');
            showcase.show(element.find('a:first'));
        });

        after(function() {
            showcase.hide();
        });

        it('should set the active state on the tabs', function(done) {
            setTimeout(function() {
                showcase.jump(1);

                expect(showcase.tabs.find('a:eq(0)').hasClass('is-active')).to.be.false;
                expect(showcase.tabs.find('a:eq(1)').hasClass('is-active')).to.be.true;
                expect(showcase.tabs.find('a:eq(2)').hasClass('is-active')).to.be.false;
                expect(showcase.tabs.find('a:eq(3)').hasClass('is-active')).to.be.false;
                expect(showcase.tabs.find('a:eq(4)').hasClass('is-active')).to.be.false;

                done();
            }, 100);
        });

        it('should set the index', function(done) {
            expect(showcase.index).to.equal(1);

            setTimeout(function() {
                showcase.jump(2);

                expect(showcase.index).to.equal(2);

                done();
            }, 100);
        });

        it('should set the loading state on the element', function(done) {
            setTimeout(function() {
                showcase.jump(3);

                expect(showcase.element.hasClass('is-loading')).to.be.true;
                expect(showcase.element.aria('busy')).to.equal('true');

                done();
            }, 100);
        });

        it('should set the caption and image', function(done) {
            setTimeout(function() {
                showcase.jump(0);

                expect(showcase.items.find('li:eq(0) img').attr('src')).to.equal('http://placehold.it/500x500/4c6278/ffffff');
                expect(showcase.caption.text()).to.equal('Foobar');

                done();
            }, 100);
        });

        it('should handle images that fail to load', function(done) {
            setTimeout(function() {
                showcase.jump(4);

                setTimeout(function() {
                    expect(showcase.element.hasClass('has-failed')).to.be.true;
                    expect(showcase.items.find('li:eq(4)').text()).to.equal('An error has occurred!');

                    done();
                }, 500);
            }, 100);
        });
    });

    describe('show()', function() {
        var node, undef;

        before(function() {
            element.find('a').removeAttr('data-showcase');

            node = element.find('a:first');
        });

        after(function() {
            showcase.hide();
        });

        it('should show the element', function(done) {
            expect(showcase.element.hasClass('show')).to.be.false;

            showcase.show(node);

            setTimeout(function() {
                expect(showcase.element.hasClass('show')).to.be.true;

                done();
            }, 10);
        });

        it('should set the node', function() {
            showcase.show(node);

            expect(showcase.node.is(node)).to.be.true;
        });

        it('should reset the index', function() {
            showcase.show(node);

            expect(showcase.index).to.equal(-1);
        });

        it('should load data from the node', function() {
            showcase.show(node);

            expect(showcase.data).to.deep.equal([
                { category: undef, title: 'Foobar', image: 'http://placehold.it/500x500/4c6278/ffffff' }
            ]);
        });

        it('should create the tab and item list item', function() {
            showcase.show(node);

            expect(showcase.items.find('li').length).to.equal(1);
            expect(showcase.tabs.find('li').length).to.equal(1);
        });

        it('should set the `is-single` class if only one item', function() {
            showcase.show(node);

            expect(showcase.element.hasClass('is-single')).to.be.true;
        });
    });

    describe('show(): grouped', function() {
        var node, undef;

        before(function() {
            element.find('a').attr('data-showcase', 'group');

            node = element.find('a:first');
        });

        after(function() {
            showcase.hide();
        });

        it('should load data from all nodes', function() {
            showcase.show(node);

            expect(showcase.data).to.deep.equal([
                { category: 'group', title: 'Foobar', image: 'http://placehold.it/500x500/4c6278/ffffff' },
                { category: 'group', title: undef, image: 'http://placehold.it/400x300/42586e/ffffff' },
                { category: 'group', title: undef, image: 'http://placehold.it/1600x900/344a5f/ffffff' },
                { category: 'group', title: undef, image: 'http://placehold.it/1500x500/293f54/ffffff' },
                { category: 'group', title: undef, image: 'http://broken.url' }
            ]);
        });

        it('should not set the `is-single` class if there are multiple items', function() {
            showcase.show(node);

            expect(showcase.element.hasClass('is-single')).to.be.false;
        });
    });

    describe('destroy()', function() {
        before(function() {
            showcase.destroy();
        });

        it('should delete the element', function() {
            expect($('body > .showcase').length).to.equal(0);
        });
    });
});

});