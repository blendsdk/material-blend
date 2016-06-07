/// <reference path="../blend/blend.d.ts" />


Blend.Runtime.ready(function() {

    Blend.DEBUG = true;

    var bodyEl = Blend.getElement(document.body);
    var mdIconsList: Array<string> = ['menu', 'search', 'insert_chart', 'insert_chart', 'insert_chart', 'insert_chart', 'info_outline', 'input', 'invert_colors', 'label', 'label_outline', 'language', 'query_builder', 'perm_identity', 'perm_media', 'perm_phone_msg', 'perm_scan_wifi', 'picture_in_picture', 'play_for_work', 'polymer', 'power_settings_new', 'print', 'thumb_down', 'thumb_up', 'thumbs_up_down', 'email', 'dialpad', 'dialer_sip', 'contacts', 'forward_5', 'stay_current_portrait', 'stay_primary_landscape', 'stay_primary_portrait', 'swap_calls', 'textsms', 'voicemail', 'vpn_key', 'group_work', 'grade', 'clear_all', 'chat_bubble_outline', 'chat_bubble', 'repeat', 'repeat_one', 'replay', 'replay_10', 'replay_30', 'replay_5', 'shuffle', 'skip_next', 'skip_previous', 'contact_phone', 'comment', 'recent_actors', 'snooze', 'sort_by_alpha', 'stop', 'subtitles', 'surround_sound', 'web', 'volume_up', 'volume_off', 'volume_mute', 'toc', 'today', 'toll', 'track_changes', 'translate', 'trending_down', 'question_answer', 'receipt', 'done', 'tab', 'tab_unselected', 'theaters', 'hd', 'games', 'hearing', 'view_module', 'view_list', 'settings_remote', 'settings_voice', 'search', 'settings', 'settings_applications', 'settings_backup_restore', 'settings_bluetooth', 'settings_brightness', 'settings_cell', 'settings_ethernet', 'settings_input_antenna', 'trending_flat', 'trending_up', 'work', 'youtube_searched_for', 'zoom_in', 'my_location', 'visibility_off', 'visibility', 'view_week', 'view_stream', 'view_quilt', 'video_library', 'videocam', 'videocam_off', 'volume_down', 'settings_overscan', 'settings_input_svideo', 'settings_input_hdmi', 'settings_input_composite', 'settings_input_component', 'launch', 'perm_device_information', 'perm_data_setting', 'zoom_out', 'alarm_on', 'dns', 'redeem', 'reorder', 'report_problem', 'restore', 'room', 'schedule', 'movie', 'android', 'announcement', 'mic_off', 'mic_none', 'swap_horiz', 'swap_vert', 'swap_vertical_circle', 'system_update_alt', 'subtitles', 'present_to_all', 'portable_wifi_off', 'phonelink_setup', 'phonelink_ring', 'phonelink_lock', 'phonelink_erase', 'person_pin', 'navigation', 'new_releases', 'not_interested', 'pause', 'pause_circle_filled', 'pause_circle_outline', 'play_arrow', 'play_circle_filled', 'play_circle_outline', 'playlist_add', 'queue', 'queue_music', 'radio', 'class', 'code', 'credit_card', 'dashboard', 'delete', 'description', 'open_with', 'pageview', 'payment', 'perm_camera_mic', 'perm_contact_calendar', 'airplay', 'done_all', 'phone', 'no_sim', 'invert_colors_off', 'chat', 'call_split', 'call_received', 'call_missed', 'call_merge', 'call_made', 'call_end', 'call', 'business', 'stop', 'sort_by_alpha', 'snooze', 'comment', 'clear_all', 'chat_bubble_outline', 'chat_bubble', 'alarm_off', 'message', 'location_on', 'location_off', 'live_help', 'album', 'av_timer', 'closed_caption', 'equalizer', 'turned_in_not', 'verified_user', 'view_agenda', 'view_array', 'view_carousel', 'view_column', 'subject', 'supervisor_account', 'settings_power', 'shop', 'shop_two', 'shopping_basket', 'shopping_cart', 'speaker_notes', 'spellcheck', 'star_rate', 'stars', 'store', 'ring_volume', 'speaker_phone', 'stay_current_landscape', 'forum', 'import_export', 'open_in_browser', 'open_in_new', 'forward_30', 'turned_in', 'view_headline', 'view_day', 'warning', 'error_outline', 'error', 'add_alert', 'settings_phone', 'forward_10', 'fast_rewind', 'fast_forward', 'explicit', 'list', 'lock', 'lock_open', 'lock_outline', 'loyalty', 'markunread_mailbox', 'note_add', 'offline_pin', 'http', 'mic', 'loop', 'library_music', 'library_books', 'library_add', 'high_quality', 'surround_sound', 'info', 'https', 'aspect_ratio', 'assessment', 'assignment', 'assignment_ind', 'assignment_late', 'mode_edit'];

    var fabPositions: Array<string> = ['top-right', 'top-center', 'top-left', 'center-right', 'center-center', 'center-left', 'bottom-right', 'bottom-center', 'bottom-left'];

    var buttonTypes: Array<string> = ['flat', 'raised', 'round-flat', 'round-raised', 'fab', 'fab-mini'];//, 'raised', 'round-flat', 'round-raised', 'fab', 'fab-mini'] //['fab', 'fab-mini', 'flat', 'raised', 'round-flat', 'round-raised'];

    var iconSizes: Array<string> = ['small', 'medium', 'large', 'xlarge'];

    var getIcon = function(): string {
        return mdIconsList[Math.floor(Math.random() * mdIconsList.length)];
    };

    var createSurface = function(name: string, style: StyleInterface = {}): Blend.dom.Element {
        var el: Blend.dom.Element = Blend.createElement({
            cls: ['debug-surface'],
            style: style,
            children: [
                {
                    tag: 'p',
                    text: name,
                    cls: ['title']
                },
                {
                    tag: 'div',
                    cls: 'body'
                }
            ]
        });
        bodyEl.append(el);
        return Blend.getElement(<HTMLElement>el.getEl().children[1]);
    };

    var createButton = function(surface: Blend.dom.Element, config: ButtonInterface) {
        var btn = new Blend.button.Button(config);
        surface.append(btn.getElement())
        btn.doInitialize();
    }

    buttonTypes.forEach(function(buttonType: string) {
        if (buttonType.inArray(['fab', 'fab-mini'])) {
            var surface = createSurface(buttonType + ' buttons', { height: 300 });
            fabPositions.forEach(function(position: string) {

                createButton(surface, {
                    icon: getIcon(),
                    buttonType: buttonType,
                    fabPosition: position
                });

            });
        } else {
            var surface = createSurface(buttonType + ' buttons');
            if (buttonType.inArray(['flat', 'raised'])) {

                // text only
                createButton(surface, {
                    text: buttonType,
                    buttonType: buttonType
                });

                // text only disbaled
                createButton(surface, {
                    text: buttonType,
                    buttonType: buttonType,
                    disabled: true
                });


                // icon only
                createButton(surface, {
                    icon: getIcon(),
                    buttonType: buttonType
                });

                // icon only disabled
                createButton(surface, {
                    icon: getIcon(),
                    buttonType: buttonType,
                    disabled: true
                });


                // text icon left
                createButton(surface, {
                    icon: getIcon(),
                    text: buttonType,
                    iconAlign: 'left',
                    buttonType: buttonType
                });


                // text icon left disbaled
                createButton(surface, {
                    icon: getIcon(),
                    text: buttonType,
                    iconAlign: 'left',
                    buttonType: buttonType,
                    disabled: true
                });


                // text icon right
                createButton(surface, {
                    icon: getIcon(),
                    text: buttonType,
                    iconAlign: 'right',
                    buttonType: buttonType
                });

                // text icon right disabled
                createButton(surface, {
                    icon: getIcon(),
                    text: buttonType,
                    iconAlign: 'right',
                    buttonType: buttonType,
                    disabled: true
                });

            } else if (buttonType.indexOf('round') !== -1) {

                iconSizes.forEach(function(iconSize: string) {

                    createButton(surface, {
                        buttonType: buttonType,
                        iconSize: iconSize,
                        icon: getIcon()
                    });

                    createButton(surface, {
                        buttonType: buttonType,
                        iconSize: iconSize,
                        icon: getIcon(),
                        disabled: true
                    });


                });
            }
        }

    });


    //
    // var iconAligns: Array<string> = ['left', 'right'];
    // var fabPositions: Array<string> = [
    //     'top-right',
    //     'top-center',
    //     'top-left',
    //     'center-right',
    //     'center-center',
    //     'center-left',
    //     'bottom-right',
    //     'bottom-center',
    //     'bottom-left'
    // ];
    // var buttons: Array<Blend.material.Material> = [];

    // var createWrapper = function(height:number = 100): Blend.dom.Element {
    //     return Blend.createElement({
    //         cls: ['t-wrapper'],
    //         style: {
    //             border: '1px solid gray',
    //             position: 'relative',
    //             height: height,
    //             margin: 5,
    //         },
    //         children: []
    //     });
    // }

    // buttonTypes.forEach(function(buttonType: string) {

    //     var wrapper = createWrapper();

    //     buttons.push(new Blend.button.Button({
    //         text: buttonType.ucfirst(),
    //         buttonType: buttonType,
    //     }));
    //     wrapper.append(buttons[buttons.length - 1].getElement());

    //     buttons.push(new Blend.button.Button({
    //         icon: fa_icon,
    //         buttonType: buttonType
    //     }));
    //     wrapper.append(buttons[buttons.length - 1].getElement());

    //     iconAligns.forEach(function(iconAlign: string) {

    //         var button = new Blend.button.Button(<ButtonInterface>{
    //             iconAlign: iconAlign,
    //             text: buttonType.ucfirst(),
    //             buttonType: buttonType,
    //             icon: fa_icon,
    //         });
    //         buttons.push(button);

    //         wrapper.append(button.getElement());

    //     });

    //     bodyEl.append(wrapper);
    // });

    // ['fab', 'fab-mini'].forEach(function(fabType: string) {
    //     var wrapper = createWrapper(300);
    //     fabPositions.forEach(function(fabPos: string) {
    //         var button = new Blend.button.Button(<ButtonInterface>{
    //             buttonType: fabType,
    //             icon: fa_icon,
    //             fabPosition: fabPos
    //         });
    //         buttons.push(button);
    //         wrapper.append(button.getElement());
    //     });
    //     bodyEl.append(wrapper);
    // });


    // buttons.forEach(function(m: Blend.material.Material) {
    //     m.doInitialize();
    // });

}).kickStart();