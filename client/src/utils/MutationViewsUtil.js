/*
 * Copyright (c) 2015 Memorial Sloan-Kettering Cancer Center.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY, WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS
 * FOR A PARTICULAR PURPOSE. The software and documentation provided hereunder
 * is on an "as is" basis, and Memorial Sloan-Kettering Cancer Center has no
 * obligations to provide maintenance, support, updates, enhancements or
 * modifications. In no event shall Memorial Sloan-Kettering Cancer Center be
 * liable to any party for direct, indirect, special, incidental or
 * consequential damages, including lost profits, arising out of the use of this
 * software and its documentation, even if Memorial Sloan-Kettering Cancer
 * Center has been advised of the possibility of such damage.
 */

/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * Singleton utility class for Mutation View related tasks.
 *
 * @author Selcuk Onur Sumer
 * @modified by Gangesh Beri
 */

/**
* Mapping between the mutation type (data) values and
* view values.
*/

const mutationStyleMap = {
    missense: {
        label: 'Missense',
        longName: 'Missense',
        style: 'missense_mutation',
        mainType: 'missense',
        priority: 3,
        color: '#1a9850',
    },
    inframe: {
        label: 'IF',
        longName: 'In-frame',
        style: 'inframe_mutation',
        mainType: 'inframe',
        priority: 4,
        color: '#8B4513',
    },
    truncating: {
        label: 'Truncating',
        longName: 'Truncating',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 6,
        color: '#000000',
    },
    nonsense: {
        label: 'Nonsense',
        longName: 'Nonsense',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 8,
        color: '#000000',
    },
    nonstop: {
        label: 'Nonstop',
        longName: 'Nonstop',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 9,
        color: '#000000',
    },
    nonstart: {
        label: 'Nonstart',
        longName: 'Nonstart',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 10,
        color: '#000000',
    },
    frameshift: {
        label: 'FS',
        longName: 'Frame Shift',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 6,
        color: '#000000',
    },
    frame_shift_del: {
        label: 'FS del',
        longName: 'Frame Shift Deletion',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 6,
        color: '#000000',
    },
    frame_shift_ins: {
        label: 'FS ins',
        longName: 'Frame Shift Insertion',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 7,
        color: '#000000',
    },
    in_frame_ins: {
        label: 'IF ins',
        longName: 'In-frame Insertion',
        style: 'inframe_mutation',
        mainType: 'inframe',
        priority: 5,
        color: '#8B4513',
    },
    in_frame_del: {
        label: 'IF del',
        longName: 'In-frame Deletion',
        style: 'inframe_mutation',
        mainType: 'inframe',
        priority: 4,
        color: '#8B4513',
    },
    splice_site: {
        label: 'Splice',
        longName: 'Splice site',
        style: 'trunc_mutation',
        mainType: 'truncating',
        priority: 11,
        color: '#000000',
    },
    fusion: {
        label: 'Fusion',
        longName: 'Fusion',
        style: 'fusion',
        mainType: 'other',
        priority: 12,
        color: '#8B00C9',
    },
    silent: {
        label: 'Silent',
        longName: 'Silent',
        style: 'other_mutation',
        mainType: 'other',
        priority: 13,
        color: '#8B00C9',
    },
    // this
    default: {
        label: 'Other',
        longName: 'Other',
        style: 'other_mutation',
        mainType: 'other',
        priority: 13,
        color: '#8B00C9',
    },
    // mutations mapped to "other" will be labelled
    // with their original data value
    other: {
        style: 'other_mutation',
        mainType: 'other',
        priority: 13,
        color: '#8B00C9',
    },
};


export const mutationTypeMap = {
    missense_mutation: mutationStyleMap.missense,
    mutation: mutationStyleMap.missense,
    missense: mutationStyleMap.missense,
    missense_variant: mutationStyleMap.missense,
    frame_shift_ins: mutationStyleMap.frame_shift_ins,
    frame_shift_del: mutationStyleMap.frame_shift_del,
    frameshift: mutationStyleMap.frameshift,
    frameshift_deletion: mutationStyleMap.frame_shift_del,
    frameshift_insertion: mutationStyleMap.frame_shift_ins,
    de_novo_start_outofframe: mutationStyleMap.frameshift,
    frameshift_variant: mutationStyleMap.frameshift,
    nonsense_mutation: mutationStyleMap.nonsense,
    nonsense: mutationStyleMap.nonsense,
    stopgain_snv: mutationStyleMap.nonsense,
    stop_gained: mutationStyleMap.nonsense,
    splice_site: mutationStyleMap.splice_site,
    splice: mutationStyleMap.splice_site,
    'splice site': mutationStyleMap.splice_site,
    splicing: mutationStyleMap.splice_site,
    splice_site_snp: mutationStyleMap.splice_site,
    splice_site_del: mutationStyleMap.splice_site,
    splice_site_indel: mutationStyleMap.splice_site,
    splice_region_variant: mutationStyleMap.splice_site,
    translation_start_site: mutationStyleMap.nonstart,
    initiator_codon_variant: mutationStyleMap.nonstart,
    start_codon_snp: mutationStyleMap.nonstart,
    start_codon_del: mutationStyleMap.nonstart,
    nonstop_mutation: mutationStyleMap.nonstop,
    stop_lost: mutationStyleMap.nonstop,
    in_frame_del: mutationStyleMap.in_frame_del,
    in_frame_deletion: mutationStyleMap.in_frame_del,
    in_frame_ins: mutationStyleMap.in_frame_ins,
    in_frame_insertion: mutationStyleMap.in_frame_ins,
    indel: mutationStyleMap.in_frame_del,
    nonframeshift_deletion: mutationStyleMap.inframe,
    nonframeshift: mutationStyleMap.inframe,
    'nonframeshift insertion': mutationStyleMap.inframe,
    nonframeshift_insertion: mutationStyleMap.inframe,
    targeted_region: mutationStyleMap.inframe,
    inframe: mutationStyleMap.inframe,
    truncating: mutationStyleMap.truncating,
    feature_truncation: mutationStyleMap.truncating,
    fusion: mutationStyleMap.fusion,
    silent: mutationStyleMap.silent,
    synonymous_variant: mutationStyleMap.silent,
    any: mutationStyleMap.default,
    other: mutationStyleMap.default,
};


/*
Mapping btw the copy number (data) values and view values.
*/
export const cnaMap = {
    '-2': {
        label: 'DeepDel', style: 'cna-homdel', tooltip: 'Deep deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    '-1': {
        label: 'ShallowDel', style: 'cna-hetloss', tooltip: 'Shallow deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    0: {
        label: 'Diploid', style: 'cna-diploid', tooltip: 'Diploid / normal', color: 'lightgray', xevalabel: 'empty', priority: 16,
    },
    1: {
        label: 'Gain', style: 'cna-gain', tooltip: 'Low-level gain', color: '#e41a1c', xevalabel: 'amp', priority: 1,
    },
    2: {
        label: 'AMP', style: 'cna-amp', tooltip: 'High-level amplification', color: '#e41a1c', xevalabel: 'amp', priority: 1,
    },
    'del0.8': {
        label: 'DeepDel', style: 'cna-homdel', tooltip: 'Deep deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    deletion: {
        label: 'DeepDel', style: 'cna-homdel', tooltip: 'Deep deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    'shallow deletion': {
        label: 'DeepDel', style: 'cna-homdel', tooltip: 'Deep deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    'deep deletion': {
        label: 'DeepDel', style: 'cna-homdel', tooltip: 'Deep deletion', color: '#0033CC', xevalabel: 'del', priority: 2,
    },
    gain: {
        label: 'Gain', style: 'cna-gain', tooltip: 'Low-level gain', color: '#e41a1c', xevalabel: 'amp', priority: 1,
    },
    amp: {
        label: 'AMP', style: 'cna-amp', tooltip: 'High-level amplification', color: '#e41a1c', xevalabel: 'amp', priority: 1,
    },
    amplification: {
        label: 'AMP', style: 'cna-amp', tooltip: 'High-level amplification', color: '#e41a1c', xevalabel: 'amp', priority: 1,
    },
    unknown: {
        label: 'NA', style: 'cna-unknown', tooltip: 'CNA data is not available for this gene', xevalabel: 'empty', priority: 16,
    },
};

export const rnaMap = {
    positive: {
        priority: 14,
    },
    negative: {
        priority: 15,
    },
    'not available': {
        priority: 16,
    },
};


export default {
    mutationTypeMap,
    cnaMap,
    rnaMap,
};
