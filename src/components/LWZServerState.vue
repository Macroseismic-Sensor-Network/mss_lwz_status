<!--
/*****************************************************************************
 * LICENSE
 *
 * This file is part of mss_lwz_status.
 * 
 * If you use mss_lwz_status in any program or publication, please inform and
 * acknowledge its authors.
 * 
 * mss_lwz_status is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * mss_lwz_status is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with mss_lwz_status. If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2019 Stefan Mertl
 *****************************************************************************/
-->

<template>
    <div id="lwz-display-container">
        <a href="http://www.mertl-research.at/mss-nrt-map/" target="blank">
        <div class="lwz-element" v-bind:style="{backgroundColor: server_state_color}">
            <span v-bind:style="{color: server_state_font_color}">{{ server_state }}</span>
        </div>
        </a>
    </div>
</template>

<script>

export default {
    name: 'LWZServerState',
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
        server_state: function() {
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

        server_state_font_color: function() {
            if (this.server_state == 'online')
            {
                return this.colors.white;
            }
            else
            {
                return this.colors.gray;
            }
        },


        server_state_color: function() {
            if (this.server_state == 'online')
            {
                return this.colors.state_green;
            }
            else
            {
                return this.colors.state_red;
            }
        },

        colors: function() {
            return this.$store.getters.colors;
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
