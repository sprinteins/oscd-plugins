import type { AlphabetLetter } from './types.utils'
import type { lnClassRegex } from './regex'

export namespace LNClass {
	export type SystemGroup =
		| `L${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'LLN0'
		| 'LPHD'
		| 'LCCH'
		| 'LGOS'
		| 'LSVS'
		| 'LTIM'
		| 'LTMS'
		| 'LTRK'

	export type DomainGroupA =
		| `A${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'ANCR'
		| 'ARCO'
		| 'ARIS'
		| 'ATCC'
		| 'AVCO'

	export type DomainGroupC =
		| `C${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'CALH'
		| 'CCGR'
		| 'CILO'
		| 'CPOW'
		| 'CSWI'
		| 'CSYN'

	export type DomainGroupF =
		| `F${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'FCNT'
		| 'FCSD'
		| 'FFIL'
		| 'FLIM'
		| 'FPID'
		| 'FRMP'
		| 'FSPT'
		| 'FXOT'
		| 'FXUT'

	export type DomainGroupG =
		| `G${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'GAPC'
		| 'GGIO'
		| 'GLOG'
		| 'GSAL'

	export type DomainGroupI =
		| `I${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'IARC'
		| 'IHMI'
		| 'ISAF'
		| 'ITCI'
		| 'ITMI'
		| 'ITPC'

	export type DomainGroupK =
		| `K${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'KFAN'
		| 'KFIL'
		| 'KPMP'
		| 'KTNK'
		| 'KVLV'

	export type DomainGroupM =
		| `M${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'MDIF'
		| 'MENV'
		| 'MFLK'
		| 'MHAI'
		| 'MHAN'
		| 'MHYD'
		| 'MMDC'
		| 'MMET'
		| 'MMTN'
		| 'MMTR'
		| 'MMXN'
		| 'MMXU'
		| 'MSQI'
		| 'MSTA'

	export type DomainGroupP =
		| `P${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'PDIF'
		| 'PDIR'
		| 'PDIS'
		| 'PDOP'
		| 'PDUP'
		| 'PFRC'
		| 'PHAR'
		| 'PHIZ'
		| 'PIOC'
		| 'PMRI'
		| 'PMSS'
		| 'POPF'
		| 'PPAM'
		| 'PRTR'
		| 'PSCH'
		| 'PSDE'
		| 'PTEF'
		| 'PTHF'
		| 'PTOC'
		| 'PTOF'
		| 'PTOV'
		| 'PTRC'
		| 'PTTR'
		| 'PTUC'
		| 'PTUF'
		| 'PTUV'
		| 'PUPF'
		| 'PVOC'
		| 'PVPH'
		| 'PZSU'

	export type DomainGroupQ =
		| `Q${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'QFVR'
		| 'QITR'
		| 'QIUB'
		| 'QVTR'
		| 'QVUB'
		| 'QVVR'

	export type DomainGroupR =
		| `R${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'RADR'
		| 'RBDR'
		| 'RBRF'
		| 'RDIR'
		| 'RDRE'
		| 'RDRS'
		| 'RFLO'
		| 'RMXU'
		| 'RPSB'
		| 'RREC'
		| 'RSYN'

	export type DomainGroupS =
		| `S${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'SARC'
		| 'SCBR'
		| 'SIMG'
		| 'SIML'
		| 'SLTC'
		| 'SOPM'
		| 'SPDC'
		| 'SPTR'
		| 'SSWI'
		| 'STMP'
		| 'SVBR'

	export type DomainGroupT =
		| `T${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'TANG'
		| 'TAXD'
		| 'TCTR'
		| 'TDST'
		| 'TFLW'
		| 'TFRQ'
		| 'TGSN'
		| 'THUM'
		| 'TLVL'
		| 'TMGF'
		| 'TMVM'
		| 'TPOS'
		| 'TPRS'
		| 'TRTN'
		| 'TSND'
		| 'TTMP'
		| 'TTNS'
		| 'TVBR'
		| 'TVTR'
		| 'TWPH'

	export type DomainGroupX =
		| `X${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'XCBR'
		| 'XSWI'

	export type DomainGroupY =
		| `Y${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'YEFN'
		| 'YLTC'
		| 'YPSH'
		| 'YPTR'

	export type DomainGroupZ =
		| `Z${AlphabetLetter}${AlphabetLetter}${AlphabetLetter}`
		| 'ZAXN'
		| 'ZBAT'
		| 'ZBSH'
		| 'ZCAB'
		| 'ZCAP'
		| 'ZCON'
		| 'ZGEN'
		| 'ZGIL'
		| 'ZLIN'
		| 'ZMOT'
		| 'ZREA'
		| 'ZRES'
		| 'ZRRC'
		| 'ZSAR'
		| 'ZSCR'
		| 'ZSMC'
		| 'ZTCF'
		| 'ZTCR'

	export type Generic = typeof lnClassRegex
}
