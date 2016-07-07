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

    export enum eResponsiveType {
        containerSize = <any>"container-size",
        windowSize = <any>"window-size"
    }

    export enum eSplitterType {
        horizontal = <any>"horizontal",
        vertical = <any>"vertical"
    }

    export enum eButtonIconSize {
        small = 18,
        medium = 24,
        large = 36,
        xlarge = 48
    }

    export enum eFABButtonPosition {
        topRight = <any>"top-right",
        topCenter = <any>"top-center",
        topLeft = <any>"top-left",
        centerRight = <any>"center-right",
        centerCenter = <any>"center-center",
        centerLeft = <any>"center-left",
        bottomRight = <any>"bottom-right",
        bottomCenter = <any>"bottom-center",
        bottomLeft = <any>"bottom-left",
        relative = <any>"relative"
    }

    export enum eButtonType {
        flat = <any>"flat",
        raised = <any>"raised",
        fab = <any>"fab",
        fabMini = <any>"fab-mini",
        roundFlat = <any>"round-flat",
        roundRaised = <any>"round-raised"
    }

    /**
     * Provided the available media query states when the screen size and the orientation is changed
     */
    export enum eMediaQuery {
        LARGE,
        MEDIUM,
        SMALL
    };

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

}