import * as React from 'react';
import { translate } from 'react-i18next';
import { t } from 'i18next';
import { connect } from 'react-redux';
import { toggleLoadModal } from '../../actions/modals';
import { bindActionCreators } from 'redux';
import { DropdownButton, MenuItem } from 'react-bootstrap';

declare var window: any;

class FileBarComponent extends React.Component<any, any> {
    private color: boolean;

    constructor(public props: any, public state: any) {
        super(props);
        this.color = false;
    }

    render() {
        return (<div className='smd-filebar'>
            <nav className='navbar'>
                <ul className='nav navbar-nav'>
                    <DropdownButton
                        title={t('fileBar.file.name')}
                        key={'dropdown-load'}
                        id={'dropdown-load'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => { this.props.actions.toggleLoadModal(true) }}>{t('fileBar.file.load')}</MenuItem>
                    </DropdownButton>
                </ul>
                <ul className='nav navbar-nav'>
                    <DropdownButton
                        title={t('fileBar.view.name')}
                        key={'dropdown-view'}
                        id={'dropdown-view'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => {
                            this.color = !this.color;
                            window['colorBlocks'](this.color);
                        }}>{t('fileBar.view.basicBlocks')}</MenuItem>
                    </DropdownButton>
                </ul>
                <ul className='nav navbar-nav'>
                    <DropdownButton
                        title={t('fileBar.config.name')}
                        key={'dropdown-options'}
                        id={'dropdown-options'}
                        noCaret
                    >
                        <MenuItem eventKey="1" onClick={() => { window['superConfigModal'](true); }}>{t('fileBar.config.superescalar')}</MenuItem>

                        <MenuItem eventKey="2" onClick={() => { window['options'](true); }}>{t('fileBar.config.options')}</MenuItem>
                    </DropdownButton>
                </ul>
                <ul className='nav navbar-nav'>
                    <DropdownButton
                        title={t('fileBar.help.name')}
                        key={'dropdown-help'}
                        id={'dropdown-help'}
                        noCaret
                    >
                        <MenuItem eventKey="1">
                            {
                                // <a href="https://etsiiull.github.io/SIMDE/">{t('fileBar.help.docs')}</a>
                            }
                        </MenuItem>

                        <MenuItem eventKey="2" onClick={() => { window['autorModal'](true); }}>{t('fileBar.help.about')}</MenuItem>
                    </DropdownButton>
                </ul>
            </nav>
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        isLoadModalOpen: state.isLoadModalOpen,
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ toggleLoadModal }, dispatch) };
}


export default translate('common', { wait: true })(connect(mapStateToProps, mapDispatchToProps)(FileBarComponent));
