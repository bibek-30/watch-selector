$(document).ready(function () {
    var other_model = false;
    $(".choose-watch .watch-item").each(function () {
        $(this).click(function () {
            var brandTitle = $(this).find(".brand-title h5").text();
            // Get the next sibling
            var $nextSibling = $(this).parent().parent().next();
            if (!$nextSibling.hasClass("variant-selector-wrap")) {
                $(this)
                    .parent()
                    .parent()
                    .after(
                        $(".footer-block__newsletter .variant-selector-wrap").detach()
                    );
            }
            $(this).parent().parent().hide();
            hasselected = false;
            $("#brands").val("");
            $(this).parent().parent().removeClass("active");
            $(".watch-item.selected").removeClass("selected");
            $(this).addClass("selected");
            $(".other-models").hide();
            other_model = false;
            showModel($(this).find(".brand-title").data("title"), brandTitle);
        });
    });

    var passedModel = false;

    $(".variant-selector-wrap .watch-item").each(function () {
        $(this).click(function () {
            var brandTitle = $(this).find(".brand-title h5").text();
            $(this).parent().parent().hide();
            $(this).parent().parent().removeClass("active");
            $(".variant-selector-wrap .watch-item.selected").removeClass("selected");
            $(this).addClass("selected");
            passedModel = true;
            showYearModel();
        });
    });

    function showYearModel() {
        console.log("passedModel1", passedModel);
        $(".year-steps").show();
        $(".year-steps").addClass("active");
        prevNext();
    }

    function showModel(id, brand) {
        console.log("hell");
        $(".variant-selector-wrap").show();
        $(".variant-selector-wrap").addClass("active");
        $(".variant-selector-wrap").find(".title-heading span").text(brand);
        $(".variant-selector-wrap .variant-selector").hide();
        $("#" + id).show();
        prevNext();
    }

    // open other models to select the watches
    $(".watch-item-other").click(function () {
        $(".other-models").show();
        other_model = true;
        $(".watch-item.selected").removeClass("selected");
    });
    var intervalId = setInterval(function () {
        if ($("#brands").val() != "" && other_model == true) {
            $(".next-btn").removeAttr("disabled");
        }

        if ($(".variant-selector-wrap").hasClass("active")) {
            if (
                $(".variant-selector-wrap.active .watch-item").hasClass("selected") ||
                passedModel == true
            ) {
                $(".next-btn").removeAttr("disabled");
                passedModel = false;
            } else {
                $(".next-btn").attr("disabled", "");
            }
        }

        if (yearModelChecked == true) {
            $(".next-btn").removeAttr("disabled");
        }
    }, 500);

    var hasselected = false;

    function prevNext(direction = "") {
        $(".watch-selector-wrap .active").each(function () {
            var $this = $(this);
            var $prevItem = $this.prev();
            var $nextItem = $this.next();
            var hasPreviousSibling = $prevItem.length > 0;
            var hasNextSibling = $nextItem.length > 0;

            $("#brands").change(function () {
                if ($(this).val() != "") {
                    hasselected = true;
                    console.log("hasselected", hasselected);
                }
            });
            console.log("hasselected", hasselected);
            if (hasselected == false) {
                if (direction === "back" && hasPreviousSibling) {
                    moveItem($prevItem);
                }

                if (direction === "next" && hasNextSibling) {
                    moveItem($nextItem);
                }
            } else {
                if (direction === "back" && hasPreviousSibling) {
                    moveItem($prevItem.prev());
                }

                if (direction === "next" && hasNextSibling) {
                    hasselected = false;
                    moveItem($nextItem.next());
                }

                var $variantSelectorWrap = $(".variant-selector-wrap").detach();
                var $parentOfVariantSelector = $variantSelectorWrap.parent();

                function updateVariantDisplay() {
                    if ($("#brands").val() != "") {
                        if (!$variantSelectorWrap.closest("html").length) {
                        } else {
                            $variantSelectorWrap.detach();
                        }
                    } else {
                        if (!$variantSelectorWrap.closest("html").length) {
                            $parentOfVariantSelector
                                .children()
                                .eq(1)
                                .before($variantSelectorWrap);
                        }
                    }
                    $(".footer-block__newsletter").append($variantSelectorWrap);
                }

                $("#brands").change(updateVariantDisplay);
                updateVariantDisplay();
            }

            $(".back-btn").toggle(hasPreviousSibling);
            $(".next-btn").toggle(hasNextSibling);

            if (
                ($(".choose-watch.active").length ||
                    $(".variant-selector-wrap.active").length) &&
                other_model == false
            ) {
                $(".next-btn").prop("disabled", $(".watch-item.selected").length === 0);
            }
        });
    }

    function moveItem($item) {
        $item.show().addClass("active");
        $item.siblings().hide().removeClass("active");
    }

    $(".back-btn").click(function () {
        prevNext("back");
        prevNext();
    });

    $(".next-btn").click(function () {
        prevNext("next");
        prevNext();
    });
    prevNext();

    // if the year is entered in between the digit the 2100 and 1900.
    var yearModelChecked = false;
    if ($(".year-steps.active")) {
        $(".next-btn").attr("disabled", "");
    }
    $("#yearInput").on("input", function () {
        var inputValue = $(this).val();
        var year = parseInt(inputValue);

        if (
            year > parseInt($(this).attr("min")) &&
            year < parseInt($(this).attr("max"))
        ) {
            $(".next-btn").removeAttr("disabled");
            yearModelChecked = true;
        }
    });

    // for checkbox in conditions of the watchs
    if ($('.checkbox-group input[type="checkbox"]:checked').length > 0) {
        $(".next-btn").removeAttr("disabled");
    } else {
        $(".next-btn").attr("disabled", "");
    }

    $('.checkbox-group input[type="checkbox"]').change(function () {
        var isChecked = $(this).prop("checked");

        $(this)
            .closest(".watch-condition-range")
            .find('.checkbox-group input[type="checkbox"]')
            .each(function () {
                $(this).prop("checked", false);
            });
        $(this)
            .closest(".checkbox-group")
            .prevAll(".checkbox-group")
            .addBack()
            .find('input[type="checkbox"]')
            .prop("checked", true);

        $(this)
            .closest(".watch-condition-range")
            .find(".checkbox-group")
            .removeClass("checked");
        $(this)
            .closest(".watch-condition-range")
            .find('.checkbox-group input[type="checkbox"]:checked')
            .closest(".checkbox-group")
            .addClass("checked");
    });
});
