<!--
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
-->

<template>
    <div id="lwz-display-container">
        <a href="http://www.mertl-research.at/mss-nrt-map/" target="blank">
        <div class="lwz-element" v-bind:style="{backgroundColor: event_state_color}">
            <span v-bind:style="{color: event_state_font_color}">{{ num_triggered_stations }}</span>
        </div>
        </a>
    </div>
</template>

<script>

export default {
    name: 'LWZTriggeredStations',
    props: {
        title: String
    },

    components: {

    },

    data() {
        return {
        };
    },

    mounted() {
    },

    computed: {
        stations: function() {
            return this.$store.getters.station_meta;
        },

        event_state_font_color: function() {
            if (this.state == 'online')
            {
                return this.colors.white;
            }
            else
            {
                return this.colors.gray;
            }
        },

        event_state_color: function() {
            if (this.state == 'online')
            {
                var triggered_pgv = Object.values(this.$store.getters.triggered_event_stations);
                var thr_values = this.$store.getters.thr_values;
                var n_yellow = 0;
                var n_orange = 0;
                var n_red = 0;
                var color = this.colors.event_green;

                for (var k = 0; k < triggered_pgv.length; k++)
                {
                    if (triggered_pgv[k] >= thr_values.yellow)
                    {
                        n_yellow++;
                    }

                    if (triggered_pgv[k] >= thr_values.orange)
                    {
                        n_orange++;
                    }
                    if (triggered_pgv[k] >= thr_values.red)
                    {
                        n_red++;
                    }
                }

                if (n_yellow >= 3)
                {
                    color = this.colors.event_yellow;
                }

                if (n_yellow >=3 && n_orange >= 1)
                {
                    color = this.colors.event_orange;
                }

                if (n_yellow >=3 && n_red >= 1)
                {
                    color = this.colors.event_red;
                }

                return color;
            }
            else
            {
                return this.colors.state_red;
            }
        },

        colors: function() {
            return this.$store.getters.colors;
        },

        state: function() {
            var state;
            const server_state = this.$store.getters.server_state;
            if (server_state == 'online')
            {
                state = 'online';
            }
            else
            {
                state = 'offline';
            }
            return state;
        },

        num_triggered_stations: function() {
            var triggered_stations;
            var n_triggered;

            if (this.state === 'offline')
            {
                return this.state
            }
            else
            {
                triggered_stations = this.$store.getters.triggered_event_stations;
                n_triggered = Object.keys(triggered_stations).length
                return n_triggered;
            }
        },
    },

    methods: {
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">

#lwz-display-container
    width: 100%
    height: 100%

    a
        text-decoration: none


    .lwz-element
        width: 100%
        height: 100%
        display: -webkit-flex
        display: -webkit-box
        display: -ms-flexbox
        display: flex  
        -webkit-align-items: center
        -webkit-box-align: center
        -ms-flex-align: center
        align-items: center
        justify-content: center

        span
            display: inline-block
            text-align: center
            font-weight: bold

</style>
