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

/**
 * @interface 
 * Interface for implementing a logger component
 */
interface LoggerInterface {

    open(): any;

    close(): any;

    log(type: string, message: string, context?: any): any;

    warn(message: string, context?: any): any;

    error(message: string, context?: any): any;

    info(message: string, context?: any): any;

    debug(message: string, context?: any): any
}
