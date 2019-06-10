import AppConsts from '@/core/precise/AppConsts'
import FormattedStringValueExtracter from './FormattedStringValueExtracter'

export function getCurrentTenancyNameOrNull(rootAddress) {
    if (rootAddress.indexOf(AppConsts.tenancyNamePlaceHolderInUrl) < 0) {
        // 网站不支持子域名租户名称
        return null
    }
    const currentRootAddress = document.location.href
    const formattedStringValueExtracter = new FormattedStringValueExtracter()
    const values = formattedStringValueExtracter.IsMatch(currentRootAddress, rootAddress)
    if (!values.length) {
        return null
    }
    return values[0]
}