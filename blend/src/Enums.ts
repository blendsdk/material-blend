/**
 * Copyright 2016 TrueSoftware B.V. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

namespace Blend {

    /**
     * Provided the available media query states when the screen size and the orientation is changed
     */
    export enum eMediaQuery {
        LARGE,
        MEDIUM,
        SMALL
    }

    /**
     * Element Scroll values
     */
    export enum eScrollState {
        none,
        auto,
        both,
        horizontal,
        vertical
    }

    export enum eBoxWrap {
        yes,
        no,
        reverse,
    }

    export enum eBoxPack {
        start,
        center,
        end,
        spaceBetween,
        spaceAround
    }

    export enum eBoxAlign {
        start,
        center,
        end,
        stretch,
        baseline
    }

    export enum eBoxItemFlex {
        none,
        auto
    }
}