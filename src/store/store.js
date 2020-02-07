/*****************************************************************************
 * LICENSE
 *
 * This file is part of mss_vis.
 * 
 * If you use mss_vis in any program or publication, please inform and
 * acknowledge its authors.
 * 
 * mss_vis is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * mss_vis is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mss_vis. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2019 Stefan Mertl
 *****************************************************************************/

import Vuex from 'vuex'
import Vue from 'vue'
import * as d3 from "d3";

Vue.use(Vuex)

function handle_msg_soh(msg_id, payload, state) {
    switch (msg_id) {
        case 'connection':
            state.server_id = payload.server_id
            if (payload.state == 'registered')
            {
                state.server_state = 'waiting for data';
            }
            else
            {
                state.server_state = payload.state;
            }
            break
        case 'server_state':
            console.log("Received a server_state.")
            break;
    }
}


function handle_msg_data(msg_id, payload, state) {
    switch (msg_id) {
        case 'pgv':
            console.log("Received pgv data.");
            break;

        case 'pgv_archive':
            console.log("Received pgv archive data.");
            break;

        case 'detection_result':
            console.log("Received a detection result");
            break;

        case 'event_data':
            console.log("Received event data.");
            break;

        case 'event_warning':
            console.log("Received event warning.");
            break;

        case 'event_archive':
            console.log("Received an event archive.");
            break;
        case 'keydata':
            console.log("Received keydata.");
            state.server_state = 'online';
            console.log(msg_id)
            console.log(payload)
            console.log(state)
            break;
    }
}


/*
function to_isoformat(date) {
    Number.prototype.pad = function(size) {
      var s = String(this);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    }

    // The month is zero-based (January = 0). Add 1 to the month.
    var isoformat_string  = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1).pad(2) + '-' + (date.getUTCDate()).pad(2) + 'T' + (date.getUTCHours()).pad(2) + ':' + (date.getUTCMinutes()).pad(2) + ':' + (date.getUTCSeconds()).pad(2) + '.' + (date.getUTCMilliseconds()).pad(6);
    return isoformat_string;
}
*/



export default new Vuex.Store({
    state: {
        stations: [],
        station_meta: [],
        connected: false,
        message: '',
        server_id: '',
        server_state: '',
        current_range: 60000,
        display_period: 600000,
    },

    getters: {
        server_state: state => {
            return state.server_state;
        },

        station_meta: (state) => {
            return state.station_meta;
        },
    },

    mutations: {
        SOCKET_ONOPEN(state, event) {
            Vue.prototype.$socket = event.currentTarget;
            state.connected = true;
            state.server_state = 'connection opened'
            console.info("Connected to websocket server.");
            //console.info("state: ", state);
            //console.info("event: ", event);
            var msg = {'class': 'control',
                   'id': 'mode',
                   'payload': 'keydata'};
            Vue.prototype.$socket.send(JSON.stringify(msg));
        },

        SOCKET_ONMESSAGE(state, payload) {
            var msg_class = payload.class
            var msg_id = payload.id

            switch (msg_class) {
                case 'soh':
                    handle_msg_soh(msg_id, payload.payload, state)
                    break;
                case 'data':
                    handle_msg_data(msg_id, payload.payload, state)
                    break;
            }
        },

        SOCKET_ONCLOSE(state, event) {
            state.connected = false;
            state.server_state = 'disconnected'
            console.info("Disconnected from server.");
            console.info("event: ", event);
        },

        SOCKET_ONERROR(state, event) {
            state.server_state = 'error';
            console.error("Websocket error.");
            console.error("state: ", state);
            console.error("event: ", event);
        },

        SOCKET_RECONNECT(state, count) {
            state.server_state = 'reconnecting';
            console.info("Reconnecting...");
            console.info("state: ", state);
            console.info("count: ", count);
        },

        SOCKET_RECONNECT_ERROR(state) {
            state.server_state = 'reconnection error';
            console.error("Error while reconnecting.");
            console.error(state);
        },

        LOAD_STATION_METADATA(state) {
            d3.csv("/assets/vue/data/mss_stations_2019_297.csv").then( function(data) {
                for (var k = 0; k < data.length; k++)
                {
                    data[k].id = data[k].network + "." +  
                                 data[k].name + "." + 
                                 data[k].location + "." +
                                 "pgv";
                }
                state.station_meta = data;
                console.log("Store :: Station metadata loaded.");
                //self.plot_stations();
            });
        },
    },

    actions: {

    }
});
