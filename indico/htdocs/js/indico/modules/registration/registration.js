(function(global) {
    'use strict';

    $(document).ready(function() {
        setupRegistrationFormScheduleDialogs();
        setupRegistrationFormSummaryPage();
        setupRegistrationList();
    });

    $(window).scroll(function(){
        IndicoUI.Effect.followScroll();
    });

    function setupRegistrationFormScheduleDialogs() {
        $('a.js-regform-schedule-dialog').on('click', function(e) {
            e.preventDefault();
            ajaxDialog({
                url: $(this).data('href'),
                title: $(this).data('title'),
                onClose: function(data) {
                    if (data) {
                        location.reload();
                    }
                }
            });
        });
    }

    function setupRegistrationFormSummaryPage() {
        $('.js-conditions-dialog').on('click', function(e) {
            e.preventDefault();
            ajaxDialog({
                url: $(this).data('href'),
                title: $(this).data('title')
            });
        });

        $('.js-check-conditions').on('click', function(e) {
            var conditions = $('#conditions-accepted');
            if (conditions.length && !conditions.prop('checked')) {
                var msg = "Please, confirm that you have read and accepted the Terms and Conditions before proceeding.";
                alertPopup($T.gettext(msg), $T.gettext("Terms and Conditions"));
                e.preventDefault();
            }
        });

        $('.js-highlight-payment').on('click', function() {
            $('#payment-summary').effect('highlight', 800);
        });
    }

    function setupStaticURLGeneration() {
        $('.js-static-url').on('click', function() {
            var $this = $(this);
            $.ajax({
                method: 'POST',
                url: $this.data('href'),
                error: handleAjaxError,
                complete: IndicoUI.Dialogs.Util.progress(),
                success: function(data) {
                    $this.copyURLTooltip(data.url);
                }
            });
        });
    }

    function setupTableSorter() {
        $('.registrations .tablesorter').tablesorter({
            cssAsc: 'header-sort-asc',
            cssDesc: 'header-sort-desc',
            headers: {
                0: {
                    sorter: false
                }
            }
        });
    }

    function getSelectedRows() {
        return $('.registrations input:checkbox:checked').map(function() {
            return $(this).val();
        }).get();
    }

    function setupRegistrationList() {
        handleRowSelection();
        setupStaticURLGeneration();
        setupTableSorter();

        $('.registrations .toolbar')
        .dropdown()
        .on('click', '.js-dialog-action', function(e) {
            e.preventDefault();
            var $this = $(this);
            ajaxDialog({
                dialogClasses: 'reglist-filter-dialog',
                trigger: this,
                url: $this.data('href'),
                title: $this.data('title'),
                onClose: function(data) {
                    if (data) {
                        $('.registrations-table-wrapper').html(data.registration_list);
                        handleRowSelection();
                        setupTableSorter();
                    }
                }
            });
        });

        $('#select-all').on('click', function() {
            $('table.i-table input.select-row').prop('checked', true).trigger('change');
        });

        $('#select-none').on('click', function() {
            $('table.i-table input.select-row').prop('checked', false).trigger('change');
        });

        $('.js-dialog-send-email').ajaxDialog({
            getExtraData: function() {
                return {registration_id: getSelectedRows()};
            }
        });

        $('.js-pdf-export').on('click', function(e) {
            e.preventDefault();
            var $this = $(this);
            $('.registrations form').attr('action', $this.data('href')).submit();
        });

        $('.registrations').on('indico:confirmed', '.js-delete-registrations', function(evt) {
            evt.preventDefault();
            var $this = $(this);
            var selectedRows = getSelectedRows();
            $.ajax({
                url: $this.data('href'),
                method: $this.data('method'),
                data: {registration_id: selectedRows},
                traditional: true,
                complete: IndicoUI.Dialogs.Util.progress(),
                error: handleAjaxError,
                success: function() {
                    for (var i = 0; i < selectedRows.length; i++) {
                        var row = $('#registration-' + selectedRows[i]);
                        row.fadeOut('fast', function() {
                            $(this).remove();
                        });
                    }
                }
            });
        });

        $('.registrations .toolbar').on('click', '.disabled', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
    }

    function handleRowSelection() {
        $('table.i-table input.select-row').on('change', function() {
            $(this).closest('tr').toggleClass('selected', this.checked);
            $('.js-requires-selected-row').toggleClass('disabled', !$('.registrations input:checkbox:checked').length);
        });
    }

    function colorizeFilter(filter) {
        filter.toggleClass('active', filter.find(':checked').length > 0);
    }

    function colorizeActiveFilters() {
        $('.reglist-filter .filter').each(function() {
            colorizeFilter($(this));
        });
    }

    global.setupRegistrationListFilter = function setupRegistrationListFilter() {
        $('.reglist-filter').dropdown({selector: '.reglist-column .title'});
        colorizeActiveFilters();

        var visibleColumnsRegItemsField = $('#visible-columns-reg-items');
        var regItemsData = JSON.parse(visibleColumnsRegItemsField.val());

        $('.reglist-column')
        .on('click', '.trigger', function() {
            var $this = $(this);
            var field = $this.closest('.reglist-column');
            var fieldId = field.data('id');
            var enabled = $this.hasClass('enabled');

            if (enabled) {
                regItemsData.splice(regItemsData.indexOf(fieldId), 1);
            } else {
                regItemsData.push(fieldId);
            }

            $this.toggleClass('enabled', !enabled);
            field.toggleClass('striped', enabled);
            visibleColumnsRegItemsField.val(JSON.stringify(regItemsData)).trigger('change');
        })
        .each(function() {
            var field = $(this);
            var fieldId = field.data('id');

            if (regItemsData.indexOf(fieldId) != -1) {
                field.find('.trigger').addClass('enabled');
            } else {
                field.addClass('striped');
            }
        });

        $('.js-reset-btn').on('click', function() {
            $('.reglist-filter input:checkbox').prop('checked', false).trigger('change');
        });

        $('.reglist-filter input:checkbox').on('change', function() {
            colorizeFilter($(this).closest('.filter'));
        });
    }
})(window);
